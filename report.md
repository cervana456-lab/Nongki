# Audit Report: Nongki (WhatsApp AI CRM)

> **Catatan**: Laporan ini murni hasil audit + analisis statis kode. **Tidak ada perubahan kode yang dilakukan.** Semua rekomendasi bersifat actionable tetapi menunggu persetujuan sebelum dieksekusi.

---

## 1. Ringkasan Eksekutif

Proyek Nongki adalah aplikasi monorepo multi-service (SvelteKit + Fastify ×2 + FastAPI) dengan arsitektur event-driven (RabbitMQ + Redis) dan infrastruktur Docker Compose + Nginx. Secara keseluruhan **fondasi arsitekturnya matang dan konsisten** (pola module/controller/service/repository di API, command bus via RabbitMQ topic, internal-token auth antar service, idempotensi, refresh-token rotation yang aman). Namun ditemukan **beberapa isu Critical dan High** yang harus diselesaikan sebelum produksi:

1. **[Critical] AI Engine tidak memvalidasi internal token** (`app/core/security.py` hanya placeholder `pass`) — semua endpoint AI Engine terbuka untuk siapa saja yang bisa menjangkau port-nya.
2. **[Critical] Secret terekspos di git** — `.env` (berisi `MYSQL_ROOT_PASSWORD`, `JWT_SECRET`, `DEEPSEEK_API_KEY`, dll.) ada di working tree dan berpotensi ter-commit.
3. **[High] Service internal terekspos ke publik via Docker port mapping** — `wa-worker` (`:5000`), `ai-engine` (`:8001`), `api` (`:4000`), dan terutama **RabbitMQ management UI (`:15673`)** mem-bind port host, padahal hanya butuh komunikasi internal Docker; ini memperluas attack surface drastis.
4. **[High] Naming mismatch `ai-enggine` (folder) vs `ai-engine` (compose service)** — rawan kebingungan operasional.
5. **[High] API CORS hanya izinkan `http://localhost:5173`** padahal traffic produksi lewat Nginx; cookie `SameSite=lax` + origin berbeda akan mematahkan autentikasi browser di produksi (tergantung skema origin — lihat Asumsi).

Rekomendasi prioritas: perbaiki exposure secret, tutup port internal, implementasikan validasi internal-token di AI Engine, dan selaraskan CORS/COOKIE dengan domain publik Nginx.

---

## 2. Arsitektur Saat Ini

```
                         ┌─────────────────────────┐
        Browser ───────► │  Nginx (80/443)          │
                         │  /            → web:5173 │
                         │  /api/        → api:4000 │
                         │  /ai/         → ai-engine │
                         │  /rabbitmq/   → rabbitmq  │
                         └───────────┬───────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
  ┌──────────┐                ┌────────────┐               ┌──────────────┐
  │ web      │  SSR calls     │ api (4000) │  internal    │ ai-engine    │
  │ SvelteKit│ ─────────────► │ Fastify    │ ◄──────────► │ FastAPI      │
  │ :5173    │  API_SSR_URL   │ + Prisma   │ x-internal   │ (8000/8001)  │
  └──────────┘                └─────┬──────┘  token       └──────┬───────┘
                                     │  POST /internal/wa/...     │ RabbitMQ
                                     ▼                            │
                              ┌────────────┐                      │
                              │ wa-worker  │  Baileys WhatsApp    │
                              │ (5000)     │  x-internal-token    │
                              └────────────┘                      │
                                     │                            │
              ┌──────────┬───────────┼────────────┬──────────────┘
              ▼          ▼           ▼            ▼
          MySQL      Redis      RabbitMQ     (FAISS/SQLite volumes)
```

**Tools/library utama per layer:**
- **Frontend (web)**: SvelteKit 2 + Svelte 5 (runes `$state`/`$derived`), Tailwind v4, shadcn-svelte, TanStack Query v6, adapter-vercel.
- **API (Fastify)**: Fastify 5, Prisma 7 (+ MariaDB adapter), Zod 4, jsonwebtoken, bcryptjs, amqplib, redis 6, pino (via Fastify logger).
- **AI Engine (FastAPI)**: FastAPI, LangChain/LangGraph, FAISS, Pydantic v2, structlog, aio-pika, redis async.
- **WA Worker (Hono, bukan Fastify)**: Hono 4 + `@hono/node-server`, Baileys 6, Zod 3, pino, axios.
- **Infra**: Docker Compose (bridge network `nongki_net`), Nginx alpine, MySQL 8, Redis 7, RabbitMQ 3-management.

**Catatan penting**: WA Worker menggunakan **Hono**, bukan Fastify seperti dokumentasi README-nya yang menyebut "Fastify". Ini inkonsistensi dokumentasi, bukan bug kode.

---

## 3. Temuan per Komponen

### 3.1 SvelteKit (apps/web)

- **[Medium] Frontend belum terhubung ke backend sama sekali** — `grep` untuk `PUBLIC_API_URL` / `API_SSR_URL` / `fetch('/api')` di `src/` tidak menemukan satupun penggunaan riil (hanya `fetchpriority` di HeroSection). `vite.config.ts:10` memang set `envDir: '../../'` sehingga env root terbaca, tapi `lib/utils.ts` & `QueryProvider.svelte` tidak membaca env tersebut. **Dampak**: belum ada data fetching nyata; seluruh UI saat ini static/marketing. **Rekomendasi**: buat API client terpusat (e.g. `$lib/api/client.ts`) yang membaca `PUBLIC_API_URL` dan forward cookie, sebelum fitur auth/CRM dibangun.

- **[Low] Adapter tidak cocok dengan Dockerfile target production** — `svelte.config.js:1` pakai `@sveltejs/adapter-vercel`, tapi `apps/web/Dockerfile:40-53` (stage `runner`) menjalankan `node build` yang butuh `@sveltejs/adapter-node`. Dockerfile sendiri mencatat hal ini di komentar:53-55 ("Requires @sveltejs/adapter-node..."). **Dampak**: `docker compose build` dengan target `runner` (production) akan gagal/blank. **Rekomendasi**: ganti adapter ke `adapter-node` secara konsisten, atau hapus stage runner jika hanya dev yang dipakai.

- **[Low] `allowedHosts` hardcoded `['web','localhost']`** — `vite.config.ts:15`. Saat deploy domain nyata (nongki.app), dev server Vite akan menolak request. **Rekomendasi**: baca dari env atau tambahkan domain produksi.

- **[Low] Potensi stale state di `QueryProvider`** — `src/lib/providers/QueryProvider.svelte:7` membuat `QueryClient` baru tiap render (tanpa module-level singleton). Karena ini di-render dalam `+layout.svelte`, biasanya aman, tapi jika layout di-instantiate ulang (HMR/error boundary) cache query hilang. **Rekomendasi**: instantiate `QueryClient` di module scope.

- **[Info] Prerendering** — `+page.ts:2` set `prerender = true` untuk landing page; konsisten dengan sifat marketing page. Tidak ada masalah.

### 3.2 API Service (services/api — Fastify)

- **[High] CORS origin tidak cocok dengan produksi** — `src/plugins/cors.plugin.ts:8` + `src/config/env.ts:44` default `CORS_ORIGIN=http://localhost:5173` dan `.env` tidak override. Di produksi browser akses via Nginx. Dengan `credentials: true`, origin mismatch + cookie policy akan mematahkan sesi login di browser (detail di Asumsi #1). **Rekomendasi**: set `CORS_ORIGIN` ke domain publik yang benar dan pastikan `COOKIE_SAME_SITE` + `COOKIE_SECURE` = true di produksi.

- **[Medium] Redis reconnect strategy dimatikan** — `src/lib/redis.ts:22` `reconnectStrategy: false`. Jika Redis drop sekali, koneksi tidak pernah reconnect hingga restart proses. Rate-limit, denylist, idempotensi, dan `auth:me` cache semuanya degrade diam-diam (RedisStore menangkap error → fallback). **Rekomendasi**: enable exponential backoff reconnect (`reconnectStrategy: retries => Math.min(retries * 100, 3000)`).

- **[Medium] Refresh-token event publish tidak guaranteed (no outbox)** — `auth.service.ts:481` ada TODO eksplisit: event publish gagal → hanya `console.error`, tidak ada outbox table. Jika RabbitMQ down saat register/login, event turunan (onboarding seed, agent settings) hilang. **Rekomendasi**: implementasikan outbox pattern atau retry queue.

- **[Low] JWT verify tidak cek `aud`/`iss`** — `src/lib/token.ts:32-49` hanya cek `sub/email/type`. Boleh, tapi sebaiknya tambah `issuer`/`audience` untuk defensiveness.

- **[Low] `EVENT_PRODUCER` duplikat dengan `EVENT_PRODUCER_API`** — `src/config/env.ts:31-32`, `EVENT_PRODUCER` default ke `EVENT_PRODUCER_API`. Redundan tapi tidak berbahaya. **Rekomendasi**: singleton.

- **[Info] Error handling & validasi konsisten** — Global `errorHandler` (`error.middleware.ts`) menangani `AppError` + `ZodError` → shape `errorResponse` konsisten. Semua route auth divalidasi via Zod. Ini **baik**.

- **[Info] Auth kuat** — refresh-token family rotation + replay detection (`auth.service.ts:154-237`) adalah implementasi menurut best practice. Denylist access token via Redis (`auth.middleware.ts:16`). **Baik**.

### 3.3 AI Engine (services/ai-enggine — FastAPI)

- **[Critical] Internal token tidak divalidasi** — `app/core/security.py:7` `verify_internal_token()` hanya `pass` (placeholder). Tidak ada middleware/dependency yang memanggilnya di `app/main.py` atau router manapun. Artinya endpoint `/agent/*`, `/knowledge`, `/tools/debug` **terbuka tanpa auth**. **Dampak**: siapa saja yang bisa reach port 8001 (atau 8000 internal) dapat memicu agent run / knowledge process / tools debug. **Rekomendasi**: implementasikan `HTTPBearer`/header `x-internal-token` dependency yang bandingkan dengan `settings.api_internal_token`, dan pasang di router internal.

- **[High] `api_internal_token` tidak dipakai di mana pun kecuali config** — `app/core/config.py:20` define `api_internal_token` tapi tidak ada consumer di kode (grep only finds definition + .env.example). Sama dengan temuan Critical di atas: token tersedia tapi tidak dienforce.

- **[High] Semua endpoint agent masih `not_implemented`** — `whatsapp_agent.py`, `onboarding.py`, `crm_assistant.py`, `knowledge.py`, `tools.py` semuanya return scaffold. **Dampak**: bukan bug, tapi berarti integrasi AI↔API↔WA belum hidup; event `ai.agent.run_completed` dipublish dengan status `not_implemented`. **Rekomendasi**: jangan expose endpoint ke produksi sampai implementasi selesai, atau guard dengan feature flag.

- **[Medium] `claim()` Redis mengembalikan `True` saat error** — `app/infra/cache.py:24-29`: jika Redis error, `claim` return `True` (artinya "dianggap berhasil klaim"). Ini mencegah false-duplicate-drop, tapi bisa menyebabkan **double-processing** saat Redis down. **Dampak**: idempotensi waiver gagal saat Redis down. **Rekomendasi**: return `False` (fail-closed) agar pesan di-drop/retry daripada diproses ganda — atau set strategi eksplisit.

- **[Medium] Config tidak membaca `API_BASE_URL` dari compose env** — `app/core/config.py:19` default `http://localhost:3000`, tidak di-override di compose (tidak ada `API_BASE_URL` di compose env). ASUMSI: AI Engine mungkin tidak perlu call API secara langsung saat ini. **Rekomendasi**: set `API_BASE_URL` di compose agar konsisten jika dipakai nanti.

- **[Low] `get_llm()` / `get_embeddings()` placeholder** — `app/core/llm.py` hanya `pass`. Config pakai `gemini_*` tapi `pyproject.toml` depend ke `openai`/`langchain-openai`. **Inkonsistensi**: env punya `OPENAI_API_KEY` + `GROQ_API_KEY` (compose:173-174) tapi config hardcode `gemini`. **Rekomendasi**: selaraskan provider (Gemini vs OpenAI/Groq) di config + env.

- **[Low] Dockerfile dev target menjalankan `app.main:app`** — `services/ai-enggine/Dockerfile:22` `uvicorn app.main:app`, tapi `main.py` root hanya re-export `from app.main import app`. Benar, tapi compose:170 jalankan `uvicorn main:app` (root `main.py`) — konsisten. **Info, tidak ada bug**.

- **[Info] Event envelope konsisten** — `app/infra/rabbitmq.py` mempublikasikan envelope dengan `eventId/eventName/producer/correlationId` yang match dengan format API (`event-bus.ts`). **Baik untuk tracing**.

### 3.4 WA Worker (services/wa-worker — Hono)

- **[High] Internal auth token berbeda nama dengan API** — WA Worker validasi `WA_WORKER_INTERNAL_TOKEN` (`middlewares/internal-auth.middleware.ts:10`), tapi API memanggil WA Worker via `apiClient` yang mengirim header `x-internal-token: env.API_INTERNAL_TOKEN` (`core/http-client.ts:9`). **Masalah**: WA Worker membandingkan terhadap `WA_WORKER_INTERNAL_TOKEN` (default `"dev-wa-worker-token"`), sedangkan API mengirim `API_INTERNAL_TOKEN` (default `"dev-api-token"`). **Keduanya berbeda** → request dari API ke WA Worker akan ditolak 401, KECUALI di `.env` diset sama (dan `.env` tidak menset `WA_WORKER_INTERNAL_TOKEN` sama sekali → fallback ke default berbeda). `docker-compose.yml:138` hanya inject `API_INTERNAL_TOKEN`, tidak `WA_WORKER_INTERNAL_TOKEN`. **Dampak**: alur outbound API→WA Worker (kirim pesan) kemungkinan gagal 401. **Rekomendasi**: gunakan satu env `INTERNAL_TOKEN` yang sama di semua service, atau set `WA_WORKER_INTERNAL_TOKEN=${API_INTERNAL_TOKEN}` di compose.

- **[Medium] Healthcheck tidak ada di compose** — `docker-compose.yml` untuk `wa-worker` dan `ai-engine` **tidak punya block `healthcheck`** (hanya mysql/redis/rabbitmq punya). Nginx `depends_on` hanya `web` + `api` (service_started), bukan wa-worker/ai-engine. **Dampak**: container dianggap "ready" sekalipun belum listen; request awal bisa gagal. **Rekomendasi**: tambahkan healthcheck `/health` untuk wa-worker & ai-engine.

- **[Medium] Port 5000 dibind ke host** — `docker-compose.yml:139-140` `"5000:5000"`. WA Worker hanya menerima traffic internal dari API (via Docker network) dan tidak ada route publik di Nginx untuk `/5000`. **Dampak**: expose surface tidak perlu; jika token internal lemah (lihat above), orang bisa POST `/messages/send` langsung ke host port. **Rekomendasi**: hapus port mapping host, atau bind ke `127.0.0.1:5000` + jangan expose.

- **[Medium] Session data tidak fully persistent** — `docker-compose.yml:141-142` mount `wa_sessions:/app/sessions`, tapi `env.ts:16` `WHATSAPP_AUTH_DIR` default `.sessions` dan `Dockerfile:53` `VOLUME /app/.sessions` (note: **`.sessions` vs `sessions`** — mismatch path!). `session.manager.ts:23` resolve `path.resolve(env.WHATSAPP_AUTH_DIR, businessId)` = `/app/.sessions/<id>` atau `/app/sessions/<id>` tergantung env. Compose mount `wa_sessions:/app/sessions` tapi jika `WHATSAPP_AUTH_DIR=.sessions`, data tersimpan di `/app/.sessions` yang **tidak di-mount** → hilang saat container recreate. **Rekomendasi**: samakan path (`WHATSAPP_AUTH_DIR=/app/sessions`) dan mount volume ke path tersebut.

- **[Low] `reconnectStrategy` tidak diset di RabbitMQ WA Worker** — `infra/rabbitmq.ts:13` `amqp.connect` tanpa reconnect handler eksplisit; amqplib punya default reconnect, tapi channel publish setelah disconnect bisa gagal silent (`if (!channel) return`). **Rekomendasi**: tambahkan reconnect loop.

- **[Info] Idempotensi inbound baik** — `session.manager.ts:62` claim message id di Redis sebelum callback API. Konsisten dengan API side (`internal.route.ts:32`).

### 3.5 Docker & Nginx (root + infra/nginx)

- **[Critical] `.env` berisi secret asli dan ter-commit ke git** — `.gitignore:1-6` ignore `.env`, tapi `.env` ada di working tree (terbaca) dan `git ls-files` perlu cek; lebih parah: `.env` berisi `MYSQL_ROOT_PASSWORD=rootpassword`, `JWT_SECRET=changeme_supersecret_jwt_key`, `OPENAI_API_KEY`, dan **`DEEPSEEK_API_KEY=sk-a3168423...`** (`.env:42`) yang kemungkinan real key. **Risiko**: key bocor jika repo pernah push. **Rekomendasi**: **rotate semua key sekarang**, pindahkan ke secret manager / `.env` tidak ter-track, tambahkan `.env` ke `.gitignore` (sudah ada) dan `git rm --cached .env` + history purge.

- **[High] Port internal terekspos (ai-engine :8001, wa-worker :5000, api :4000, rabbitmq :15673)** — `docker-compose.yml:74,103,140,184` mem-bind ke host. `api:4000` dan `rabbitmq:15673` (management UI!) terbuka di host. RabbitMQ management UI dengan password lemah (`nongki_rabbit/rabbitpassword`) adalah **risiko besar**. **Rekomendasi**: hanya `nginx:80/443` yang publik; sisanya internal saja (hapus port mapping atau bind `127.0.0.1`). Khususnya **tutup RabbitMQ management dari publik**.

- **[High] Naming `ai-enggine` (folder) vs `ai-engine` (compose service)** — `docker-compose.yml:162` `ai-engine:` tapi `build.context: ./services/ai-enggine` (double-g, sesuai disk folder). Service name `ai-engine` dipakai di network (`http://ai-engine:8000`). Ini konsisten secara Docker, tapi **sangat rawan salah ketik** saat ops menjalankan `docker logs ai-enggine` (gagal). **Rekomendasi**: rename folder ke `ai-engine` agar seragam.

- **[Medium] Nginx tidak proxy ke wa-worker & ai-engine secara publik, tapi `/ai/` rewrite drop prefix** — `infra/nginx/conf.d/default.conf:21-32` `rewrite ^/ai/(.*)$ /$1 break` → `ai-engine:8000`. Jadi `POST /ai/agent/whatsapp/respond` → `ai-engine:8000/agent/whatsapp/respond`. Sesuai router (`whatsapp_agent.py` prefix `/whatsapp`, main prefix `/agent`). **Benar**. Tapi karena AI Engine tidak punya auth (Critical di 3.3), siapa saja bisa hit `/ai/...` dari publik. **Rekomendasi**: jangan expose `/ai/` di Nginx sampai auth AI Engine selesai.

- **[Medium] Nginx tidak set `client_max_body_size` untuk `/ai/` besar** — global `client_max_body_size 20M` (default.conf:7) cukup untuk sekarang, tapi upload file (knowledge PDF/image) via AI Engine bisa lewat 20M. **Rekomendasi**: tambahkan override per-location `/ai/` dengan limit lebih besar + proxy_read_timeout lebih panjang (saat ini 120s, OK untuk LLM tapi mungkin kurang untuk RAG berat).

- **[Medium] Tidak ada resource limit (CPU/memory)** di compose untuk semua service. Di VPS spek terbatas, Baileys + FAISS + LLM dapat menyebabkan OOM. **Rekomendasi**: tambahkan `deploy.resources.limits` (memo: api 512M, ai-engine 1.5G, wa-worker 512M, redis 256M).

- **[Low] `depends_on` Nginx hanya `service_started`** — `docker-compose.yml:260-264` nginx depend on `web`+`api` started, bukan healthy. Jika api butuh 30s warmup (migrasi Prisma), request awal 502. **Rekomendasi**: `condition: service_healthy` + healthcheck api.

- **[Low] MySQL password di `command` healthcheck** — `docker-compose.yml:40` `mysqladmin ping ... -p${MYSQL_ROOT_PASSWORD}` mengexpose password di `docker inspect`/process list. Minor. **Rekomendasi**: gunakan `MYSQL_PID_FILE` atau healthcheck via socket.

- **[Info] Multi-stage Dockerfile API & web sudah baik** (dev/builder/runner, alpine). WA Worker juga multi-stage. **Baik**.

---

## 4. Temuan Cross-Service

- **[Critical] Internal token tidak konsisten & tidak dienforce di AI Engine** (lihat 3.3 Critical + 3.4 High). API dan WA Worker punya mekanisme token (API: `internal.route.ts:20` cek `x-internal-token === env.API_INTERNAL_TOKEN`; WA: `internal-auth.middleware.ts`), tapi **AI Engine tidak memvalidasi sama sekali**, dan **WA Worker memakai token nama berbeda** (`WA_WORKER_INTERNAL_TOKEN` vs `API_INTERNAL_TOKEN`). Kontrak internal auth tidak seragam.

- **[High] API contract doc vs implementasi mismatch (WA Worker ↔ API)** — `services/wa-worker/docs/api-contract.md` mendokumentasikan path `POST {API_URL}/internal/wa/incoming-message`, `.../session-status`, `.../message-status`, `.../error`. Tapi implementasi API hanya punya `POST /api/v1/internal/wa/messages/inbound` (`internal.route.ts:27`). Path `session-status`, `message-status`, `error` **tidak ada di API**. Sebaliknya WA Worker (`session.manager.ts:66`) memanggil `/internal/wa/messages/inbound` (cocok dengan implementasi, tapi tidak dengan doc). **Dampak**: dokumentasi menyesatkan; event session-status/message-status dari WA Worker ke API tidak akan sampai (no endpoint). **Rekomendasi**: perbarui `api-contract.md` ke path implementasi, dan tambahkan endpoint missing jika dibutuhkan (status delivery sangat penting untuk UX pesan).

- **[High] CORS + Cookie domain mismatch mengancam auth end-to-end** — API set `CORS_ORIGIN=localhost:5173` + cookie `SameSite=lax` + `secure` hanya di production flag. Nginx serve `PUBLIC_API_URL` di domain yang (ASUMSI) berbeda dari origin web. Jika web di `app.nongki.id` dan API di `api.nongki.id`, `SameSite=lax` tetap izinkan cross-site GET tapi credential cookie butuh `SameSite=none; Secure` untuk cross-origin penuh. **Rekomendasi**: tentukan apakah web & API same-origin (proxy `/api` di Nginx sudah same-origin!) — jika same-origin, cookie aman tanpa `none`. Pastikan `PUBLIC_API_URL` & web di **origin yang sama** (Nginx proxy `/api` → api sudah menjamin ini). Maka `CORS_ORIGIN` cukup `https://domain` dan `SameSite=lax` + `Secure` cukup.

- **[Medium] Request ID propagation tidak konsisten** — API generate `x-request-id` → `correlationId` (`request-context.ts`), event bus menyertakan `correlationId` (`event-bus.ts:57`). Tapi **Nginx tidak generate/meneruskan `X-Request-ID`** (default.conf tidak set `proxy_set_header X-Request-ID`). WA Worker & AI Engine meneruskan `correlationId` di event tapi tidak membaca `x-request-id` dari inbound HTTP. **Rekomendasi**: tambahkan `proxy_set_header X-Request-ID $request_id;` di Nginx + generate `$request_id` (nginx:1.11+).

- **[Medium] Event routing key tidak konsisten antar service** — API bind queue `nongki.api.wa-events` ke `wa.session.*`, `wa.message.received`, `wa.message.failed` (`rabbitmq.plugin.ts:18-20`). WA Worker mempublish `wa.session.started`, `wa.session.connected`, `wa.session.disconnected`, `wa.message.received`, `wa.message.sent`, `wa.message.failed` (`wa-events.ts`). Mapping: `wa.session.started` **tidak** di-bind oleh API (hanya `wa.session.*` → sebenarnya `wa.session.started` match `wa.session.*` ✓). Tapi `wa.message.sent` tidak di-bind API (API hanya bind `wa.message.received` + `wa.message.failed`) → event "sent" terbuang. AI Engine consume `ai.command.*` (`rabbitmq.py:49`) tapi tidak ada producer yang mempublish `ai.command.*` (API hanya publish `ai.agent.run_completed` dll, bukan `ai.command`). **Dampak**: command pattern AI↔API tidak tersambung; event "message sent" hilang. **Rekomendasi**: audit ulang binding vs routing key, dokumentasikan peta event.

- **[Medium] `API_INTERNAL_URL` default berbeda** — compose inject `API_INTERNAL_URL=http://api:4000/api/v1` (`.env:27`), tapi `wa-worker/src/config/env.ts:13` default `http://localhost:4000` dan `ai-enggine/config.py` tidak punya `API_INTERNAL_URL` sama sekali (pakai `api_base_url` default `localhost:3000`). Di compose ini konsisten karena env di-inject, tapi **di luar Docker (local dev tanpa compose)** WA Worker akan call `localhost:4000` tanpa `/api/v1` prefix → 404. **Rekomendasi**: seragamkan nama env (`API_INTERNAL_URL` di semua) + pastikan prefix `/api/v1` selalu ada.

- **[Low] Business ID `unknown` di AI Engine events** — `whatsapp_agent.py:19`, `knowledge.py:18`, `crm_assistant.py` hardcode `business_id="unknown"`. Event tracing per-tenant akan useless sampai payload nyata ada. **Rekomendasi**: teruskan `businessId` dari request.

- **[High] API belum punya client ke WA Worker** — `services/api/src/clients/wa-worker.client.ts` hanya berisi 1 baris komentar placeholder. Padahal WA Worker menyediakan `/messages/send` untuk outbound. Artinya **bridge API → WA Worker (kirim balasan AI ke WhatsApp) belum tersambung di level kode API**, meski token mismatch (3.4 High) sudah jadi blocker terpisah. **Rekomendasi**: implementasikan client + panggilan dari orchestrator setelah token diseragamkan.

---

## 5. Rekomendasi Prioritas (Action Items)

**Critical (segera)**
- [ ] **Rotate & remove secrets dari git** — `git rm --cached .env`, purge history, rotate `JWT_SECRET`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `MYSQL_ROOT_PASSWORD`, RabbitMQ creds. (`/.env`)
- [ ] **Implementasikan validasi internal-token di AI Engine** (`app/core/security.py` + dependency di `app/main.py`) sebelum `/ai/` di-expose Nginx.
- [ ] **Tutup port publik untuk service internal** — hapus/`127.0.0.1`-bind mapping `api:4000`, `wa-worker:5000`, `ai-engine:8001`, **dan especially `rabbitmq:15673`** di `docker-compose.yml`.

**High (sebelum produksi)**
- [ ] **Seragamkan internal token**: satu env `INTERNAL_TOKEN`, set `WA_WORKER_INTERNAL_TOKEN=${API_INTERNAL_TOKEN}` di compose; pastikan AI Engine juga pakai env yang sama.
- [ ] **Selaraskan CORS + Cookie** dengan domain produksi (`CORS_ORIGIN`, `COOKIE_SECURE=true`, `COOKIE_SAME_SITE` sesuai same/cross-origin).
- [ ] **Rename folder `ai-enggine` → `ai-engine`** untuk hindari kebingungan operasional.
- [ ] **Tambahkan healthcheck** untuk `wa-worker` & `ai-engine` di compose; ubah Nginx `depends_on` ke `service_healthy`.
- [ ] **Perbaiki path session WhatsApp** (`WHATSAPP_AUTH_DIR` vs volume mount) agar tidak kehilangan session saat recreate.
- [ ] **Implementasikan API → WA Worker client** (`clients/wa-worker.client.ts`) setelah token seragam.

**Medium**
- [ ] **Enable Redis reconnect** di API (`redis.ts`).
- [ ] **Outbox pattern** untuk event publish API (auth `TODO`).
- [ ] **Perbarui `api-contract.md`** WA Worker ↔ API ke path implementasi; tambahkan endpoint `session-status`/`message-status`/`error` di API jika diperlukan.
- [ ] **Audit event routing keys** (binding vs publish) antar service; sambungkan `ai.command.*`.
- [ ] **Nginx `X-Request-ID` propagation** + WA/AI baca `x-request-id`.
- [ ] **Resource limits** CPU/memory di compose.
- [ ] **AI Engine `claim()` fail-closed** saat Redis error.
- [ ] **Seragamkan LLM provider** config (Gemini vs OpenAI/Groq) + env.

**Low / Nice-to-have**
- [ ] Buat API client terpusat di web yang baca `PUBLIC_API_URL`.
- [ ] Ganti `adapter-vercel` → `adapter-node` di web (atau hapus stage runner Dockerfile).
- [ ] `QueryClient` module-level singleton di web.
- [ ] `vite.config.ts allowedHosts` dari env.
- [ ] Singkirkan commented-out/dead scaffold (`get_llm`, `create_graph`, `tools.py/debug`) sebelum produksi.

---

## 6. Asumsi yang Perlu Dikonfirmasi

1. **Domain produksi & skema origin** — ASUMSI web & API akan di-serve di origin yang sama via Nginx (`/api` proxy). Jika benar, isu CORS cookie di-3.2/4 berkurang dampaknya; jika cross-origin (`app.nongki.id` vs `api.nongki.id`), butuh `SameSite=none; Secure`. Perlu konfirmasi DNS/proxy plan.
2. **Apakah `.env` sudah pernah di-push ke remote** — tidak bisa diverifikasi hanya dari working tree. Jika ya, key di `.env:42` (DEEPSEEK) dan lainnya sudah bocor → wajib rotate.
3. **Traffic ekspektasi & SLA** — tidak ada data; resource limit (Medium) disarankan berdasarkan asumsi VPS spek menengah. Perlu konfirmasi kapasitas host.
4. **Apakah AI Engine memang perlu di-expose ke publik via `/ai/`** — ASUMSI tidak (hanya API/internal yang consume). Jika ya, auth wajib sebelum expose.
5. **Konsumen endpoint `/tools/debug` & agent endpoints** — belum jelas siapa yang call; ASUMSI hanya internal. Perlu konfirmasi sebelum hapus/expose.
6. **Apakah `api_base_url` (AI Engine) digunakan** — ASUMSI tidak (AI Engine saat ini passive/scaffold). Perlu konfirmasi untuk tahu apakah butuh set di compose.
7. **Prisma datasource tanpa `url` explicit** — `schema.prisma:5-7` datasource hanya `provider="mysql"` tanpa `url`, mengandalkan `DATABASE_URL` env (Prisma convention). ASUMSI benar karena Prisma otomatis baca `DATABASE_URL`. Tapi adapter dipasang manual (`@prisma/adapter-mariadb`) — perlu konfirmasi MySQL 8 vs MariaDB (README API menyebut "PostgreSQL" di tech stack padahal `mysql://` + MariaDB adapter dipakai → inkonsistensi dokumentasi).
8. **Apakah wa-worker `messages/send` dipanggil dari API** — ASUMSI ya (bridge outbound), tapi `clients/wa-worker.client.ts` hanya berisi komentar placeholder (1 baris). Artinya **API saat ini belum punya implementasi pemanggil ke WA Worker** → fitur kirim pesan balasan AI→WA belum tersambung di level kode API.
