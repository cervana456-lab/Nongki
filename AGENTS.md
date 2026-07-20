# AGENTS.md — Ningki/Nongki Microservice Workspace Guide

This repository is a WhatsApp-first Reactive CRM for UMKM F&B. Treat this file as the root navigation and execution guide for coding agents.

The goal of this guide is to help agents read the repository quickly, respect service boundaries, avoid unsafe rewrites, and use the right tools/skills when modifying code.

---

## 1. Product Goal

Ningki/Nongki turns WhatsApp conversations into:

* customer data
* AI-assisted replies
* Customer 360
* order and reservation actions
* owner digest
* reminders
* safe campaign/action approval
* human handoff when AI is not enough

Core principle:

> AI may reason and recommend, but business data mutation must go through controlled internal API tools.

The system is not just a chatbot. It is a Reactive CRM:

```txt
Customer chat
→ AI understands context
→ Customer profile is updated
→ Business insight is generated
→ Owner/admin approves action
→ System executes safely through API
```

---

## 2. Current Repository Layout

Actual root layout:

```txt
.
├── AGENTS.md
├── apps/
│   └── web/
├── infra/
│   └── nginx/
├── services/
│   ├── api/
│   ├── ai-enggine/
│   ├── repomix-output.xml
│   └── wa-worker/
├── docker-compose.yml
├── report.md
├── repomix-output.xml
└── coba.md
```

Expected long-term documentation layout:

```txt
.
├── AGENTS.md
├── docs/
│   ├── database-flow.md
│   └── services/
│       ├── api.md
│       ├── ai-enggine.md
│       └── wa-worker.md
├── apps/
│   └── web/
├── services/
│   ├── api/
│   ├── ai-enggine/
│   └── wa-worker/
└── infra/
    └── nginx/
```

Notes:

* `report.md` is a high-level source of truth for the AI/backend ecosystem.
* `repomix-output.xml` files are generated merged code snapshots. Treat them as read-only references.
* Do not edit `repomix-output.xml` directly.
* `coba.md` is a scratch/current working document unless a task explicitly says otherwise.
* Keep `ai-enggine` as the folder name unless a dedicated rename migration updates all imports, Docker paths, docs, and deployment references.
* In documentation, `ai-engine` and `ai-enggine` may refer to the same AI service. Prefer the actual folder name in commands.

---

## 3. Main Workspace Areas

### `apps/web`

SvelteKit web application.

Responsibilities:

* Landing page and static marketing pages.
* Auth pages.
* Dashboard UI.
* Product, pricing, docs, workflow, solution, and feature pages.
* Calls backend through HTTP API.
* Does not access databases directly.

Rules:

* Keep UI reusable.
* Preserve `src/lib/components/ui/**` as the UI primitive library.
* Do not put backend business logic in the frontend.
* Do not hardcode service internals if API clients/config already exist.
* Prefer existing components before creating new UI primitives.
* Keep landing/static pages minimal and workflow-focused.

Common commands:

```bash
cd apps/web
pnpm install
pnpm lint
pnpm build
```

---

### `services/api`

Main backend and only direct PostgreSQL owner.

Responsibilities:

* Auth and workspace creation.
* Prisma schema and migrations.
* Business logic.
* Tenant validation.
* Internal tool endpoints for AI.
* Agent run and tool execution persistence.
* Orders.
* Reservations.
* Payments.
* Reminders.
* Notifications.
* Webhooks.
* Cron jobs.
* All writes to PostgreSQL.

Rules:

* No AI reasoning inside `api`.
* No WhatsApp session runtime management beyond persisted metadata.
* Validate `businessId` for every tenant-scoped read/write.
* Internal endpoints must require internal token middleware.
* Database writes should happen through repositories/services, not controllers.
* Controllers should stay thin.
* Schemas should validate request/response boundaries.
* Repositories should contain DB access.
* Services should contain business rules.

Common commands:

```bash
cd services/api
pnpm install
pnpm test
pnpm build
```

---

### `services/ai-enggine`

AI reasoning service.

Responsibilities:

* FastAPI endpoints.
* LangGraph agents.
* Intent classification.
* RAG retrieval.
* Tool planning.
* Guardrails.
* Response generation.
* Local FAISS indexes.
* Calling `services/api` via internal HTTP client.

Rules:

* Never access PostgreSQL directly.
* Never write business data directly.
* Every agent state must carry `business_id`.
* Every RAG search must be namespace-filtered by `business_id`.
* Every tool call must go through `services/api` internal endpoints.
* Record agent run and tool execution through API client once implementation begins.
* Do not implement business mutations inside tools directly. Tools should call API.
* Placeholder files may stay placeholder unless task explicitly asks for implementation.

Common commands:

```bash
cd services/ai-enggine
uv sync
uv run pytest
uv run ruff check .
uv run mypy app
```

---

### `services/wa-worker`

WhatsApp gateway.

Responsibilities:

* Baileys session lifecycle.
* QR generation.
* Message normalization.
* Sending outbound WhatsApp messages.
* Forwarding inbound events to `services/api`.
* Handling WhatsApp-specific transport concerns.

Rules:

* Never access PostgreSQL directly.
* Never run AI reasoning.
* Never implement heavy business logic.
* Use idempotency for inbound/outbound message handling.
* Internal calls to `services/api` must use internal token.
* Keep WhatsApp session concerns inside this service.
* Keep domain decisions inside `services/api` or `services/ai-enggine`.

Common commands:

```bash
cd services/wa-worker
pnpm install
pnpm test
pnpm build
```

---

### `infra/nginx`

Infrastructure routing layer.

Responsibilities:

* Reverse proxy config.
* Local/dev routing.
* Service gateway rules if present.

Rules:

* Do not change infra routing unless the task is about deployment, networking, or service exposure.
* Keep route names aligned with `docker-compose.yml`.
* Avoid hardcoding local machine paths.

---

## 4. Critical Runtime Flow

```txt
Customer WhatsApp
→ services/wa-worker
→ services/api
→ services/ai-enggine
→ LangGraph agent
→ controlled internal tool call
→ services/api
→ PostgreSQL
→ services/api
→ services/wa-worker
→ WhatsApp customer
```

Important:

```txt
Only services/api writes to PostgreSQL.
AI Engine thinks and plans.
WA Worker transports WhatsApp messages.
Web app displays and triggers API actions.
```

---

## 5. Service Ownership Rules

### Database Ownership

```txt
services/api      → owns PostgreSQL through Prisma
services/ai-enggine → no direct PostgreSQL access
services/wa-worker → no direct PostgreSQL access
apps/web         → no direct PostgreSQL access
```

If a task requires data mutation:

1. Add or update API service logic in `services/api`.
2. Expose controlled internal/public endpoint if needed.
3. Make AI/WA/Web call the API.
4. Do not bypass API ownership.

---

### AI Ownership

AI behavior belongs in:

```txt
services/ai-enggine/app/agents
services/ai-enggine/app/rag
services/ai-enggine/app/tools
services/ai-enggine/app/services
services/ai-enggine/app/core
```

AI should not:

* directly write database records
* directly call Prisma
* directly own order/reservation/payment logic
* bypass API validation
* send WhatsApp messages directly unless explicitly designed through an API/WA worker call

---

### WhatsApp Ownership

WhatsApp runtime behavior belongs in:

```txt
services/wa-worker/src/whatsapp
services/wa-worker/src/modules/sessions
services/wa-worker/src/modules/messages
services/wa-worker/src/consumers
```

WA worker should not:

* classify business intent
* create orders directly
* create reservations directly
* decide CRM state transitions
* access Prisma/database

---

### Frontend Ownership

Frontend behavior belongs in:

```txt
apps/web/src/routes
apps/web/src/lib/components
apps/web/src/lib/constants
apps/web/src/lib/auth
apps/web/src/lib/providers
```

Frontend should not:

* duplicate backend business rules
* call AI engine directly unless explicitly configured
* access database directly
* store sensitive internal tokens in browser code

---

## 6. AI Engine Folder Intent

```txt
services/ai-enggine/app/
├── api/         # FastAPI routers only
├── agents/      # LangGraph graph, nodes, prompts, state
├── consumers/   # RabbitMQ command consumers
├── core/        # config, logging, LLM factory, security, errors
├── events/      # event publishing helpers
├── infra/       # Redis, RabbitMQ, cache, locks
├── rag/         # loader, extractor, splitter, embeddings, vectorstore, retriever, indexer
├── schemas/     # Pydantic request/response contracts
├── services/    # orchestration services and API client
├── storage/     # local FAISS/tmp directories
└── tools/       # controlled tool classes that call services/api
```

Recommended AI flow target:

```txt
receive_message
→ load_business_context
→ load_customer_profile
→ load_conversation_history
→ check_human_takeover
→ classify_intent
→ retrieve_knowledge
→ decide_action
→ tool_router
→ execute_tool
→ generate_reply
→ save_state
→ return_reply
```

---

## 7. API Service Folder Intent

```txt
services/api/src/
├── clients/       # internal clients to ai-enggine and wa-worker
├── config/        # env parsing
├── lib/           # cross-cutting helpers
├── middlewares/   # auth, business context, internal token, errors
├── modules/       # domain modules: controller, route, schema, service, repository, types
├── plugins/       # Fastify plugins
├── types/         # shared TS declarations
├── utils/         # small shared utilities
├── app.ts
├── container.ts
├── routes.ts
└── server.ts
```

Module convention:

```txt
modules/<domain>/
├── <domain>.controller.ts
├── <domain>.route.ts
├── <domain>.schema.ts
├── <domain>.service.ts
├── <domain>.repository.ts
└── <domain>.types.ts
```

Rules:

* `route` wires endpoints.
* `controller` handles request/response.
* `schema` validates input/output.
* `service` owns business flow.
* `repository` owns Prisma/database access.
* `types` owns local domain types.

---

## 8. WA Worker Folder Intent

```txt
services/wa-worker/src/
├── config/
├── consumers/
├── core/
├── events/
├── infra/
├── middlewares/
├── modules/
│   ├── health/
│   ├── messages/
│   └── sessions/
├── whatsapp/
├── app.ts
├── routes.ts
└── server.ts
```

Rules:

* `whatsapp/` owns Baileys/session internals.
* `modules/sessions` owns HTTP session endpoints.
* `modules/messages` owns send-message endpoints.
* `consumers` may handle queue-based WA commands.
* `infra` owns Redis/RabbitMQ/idempotency/rate-limit helpers.

---

## 9. Web App Folder Intent

```txt
apps/web/src/
├── lib/
│   ├── auth/
│   ├── components/
│   │   ├── auth/
│   │   ├── features/
│   │   ├── home/
│   │   ├── layouts/
│   │   ├── pricing/
│   │   ├── product/
│   │   ├── solutions/
│   │   └── ui/
│   ├── constants/
│   ├── hooks/
│   ├── providers/
│   └── utils.ts
└── routes/
```

Rules:

* `components/ui/**` is the UI library. Preserve it.
* Marketing/static pages should be minimal.
* Landing page should stay focused on Hero, Problem, Workflow, Features, Owner Digest, Pricing/CTA.
* Workflow/cara kerja sections must remain visible.
* Avoid over-sectioning static pages.
* Do not place API secrets in frontend code.

---

## 10. Safe Refactor Policy

When asked to “fix foldering”:

1. Move folders only; do not rewrite existing logic.
2. Fill empty files only when they are truly empty and safe.
3. Do not replace placeholder implementations unless the task explicitly asks for implementation.
4. Keep `.gitkeep` files empty.
5. Preserve existing imports when moving folders unless path references break.
6. Do not rename `ai-enggine` to `ai-engine` without a separate rename migration task.
7. Do not remove service docs unless they are duplicates and a better root doc replaces them.
8. Do not add direct database access to `ai-enggine` or `wa-worker`.
9. Do not add business writes outside `services/api`.
10. Do not edit generated Repomix files.
11. Do not update Docker or Nginx paths unless folder movement requires it.
12. Do not change API contracts unless explicitly requested.

---

## 11. Empty File Fill Policy

Allowed:

* Add package docstrings to empty Python `__init__.py`.
* Add safe export barrels only when exports exist and imports are stable.
* Add TypeScript declaration comments to empty `.d.ts`.
* Add minimal utility implementation only if the file name is clearly required and tests/imports fail.
* Add docs to empty `.md` files.
* Add `AGENTS.md` at root.

Not allowed:

* Changing existing controllers/services/repositories.
* Replacing placeholder functions with business logic.
* Adding new database queries outside `services/api`.
* Changing Prisma schema during foldering-only tasks.
* Changing API contracts without explicit instruction.
* Filling `.gitkeep` files.
* Editing `repomix-output.xml`.

---

## 12. Repomix Policy

Repomix files are reference snapshots.

Examples:

```txt
repomix-output.xml
services/repomix-output.xml
apps/web/repomix-output.xml
```

Rules:

* Do not edit Repomix outputs.
* Use them only to understand code structure.
* Apply changes to real source files.
* If a task asks for “analyze repo from Repomix”, read it, but do not treat it as the editable source.
* If generated snapshots are stale, prefer real directory files.

---

## 13. Global Skills Usage

Before coding, inspect available global skills in `~/.agents/skills` if present.

Use relevant skill guidance when modifying:

* TypeScript backend patterns.
* Node.js backend patterns.
* JavaScript testing patterns.
* TypeScript advanced types.
* Modern JavaScript patterns.
* Svelte/SvelteKit frontend guidance if available.
* Next/frontend guidance only when conceptually useful and not conflicting.
* Any project-specific skill loaded in the agent environment.

Do not blindly apply a skill if it conflicts with this repository’s service ownership rules.

Priority order:

```txt
1. This AGENTS.md
2. User task
3. Existing code conventions
4. Service README/docs/report.md
5. Global skills
6. General best practices
```

---

## 14. Common Root Commands

From repo root:

```bash
ls
ls apps
ls apps/web
ls services
ls services/api
ls services/ai-enggine
ls services/wa-worker
ls infra
```

Docker:

```bash
docker compose up --build
docker compose up --build -d
docker compose logs -f
docker compose ps
docker compose down
```

Search:

```bash
rg "TODO|FIXME|placeholder|not_implemented|pass" .
rg "businessId|business_id" services
rg "PrismaClient|@prisma/client" services
rg "postgres|DATABASE_URL" services
```

Find empty files:

```bash
find . -type f -empty | sort
```

Find generated Repomix files:

```bash
find . -name "repomix-output.xml" -type f
```

---

## 15. Service Commands

### Web App

```bash
cd apps/web
pnpm install
pnpm lint
pnpm build
```

### API

```bash
cd services/api
pnpm install
pnpm test
pnpm build
```

### WA Worker

```bash
cd services/wa-worker
pnpm install
pnpm test
pnpm build
```

### AI Engine

```bash
cd services/ai-enggine
uv sync
uv run pytest
uv run ruff check .
uv run mypy app
```

If dependencies are missing, report the exact error and avoid large unrelated fixes.

---

## 16. Task Execution Checklist

Before editing:

```txt
1. Read the relevant files.
2. Identify the actual service boundary.
3. Check imports and route registration.
4. Check whether the file is generated or real source.
5. Explain the current flow briefly.
6. Make a minimal plan.
```

While editing:

```txt
1. Keep changes narrow.
2. Do not rewrite unrelated code.
3. Prefer existing patterns.
4. Preserve naming conventions.
5. Preserve service ownership.
6. Update docs if foldering or flow changes.
```

After editing:

```txt
1. Run targeted lint/test/build when possible.
2. Search for broken imports.
3. Report changed files.
4. Report intentionally untouched files.
5. Report remaining TODOs.
```

---

## 17. Foldering Task Checklist

When asked to fix foldering:

```txt
- Confirm services are under services/.
- Confirm apps/web stays under apps/web.
- Confirm infra/nginx stays under infra/nginx.
- Confirm root AGENTS.md exists.
- Confirm report.md remains at root unless task says move it.
- Confirm generated Repomix files are not edited.
- Fill safe empty files only.
- Keep .gitkeep empty.
- Do not implement placeholders.
- Do not change DB ownership.
- Run or report validation commands.
```

---

## 18. Security and Tenant Rules

Always enforce tenant safety:

```txt
- businessId/business_id must be present in tenant-scoped operations.
- API validates tenant ownership.
- AI state carries business_id.
- RAG indexes use business_id namespace/filter.
- WA messages are linked to business/session metadata through API.
- Internal endpoints require internal token.
```

Never:

```txt
- expose internal tokens to browser code
- trust businessId from frontend without validation
- let AI mutate database directly
- let WA worker mutate domain data directly
- skip idempotency for incoming WhatsApp messages
- skip webhook signature/idempotency for payment callbacks
```

---

## 19. Implementation Boundaries by Feature

### Incoming WhatsApp Message

```txt
wa-worker:
- receive Baileys event
- normalize message
- forward to API

api:
- idempotency check
- upsert customer/conversation
- save inbound message
- call AI engine if bot active

ai-enggine:
- reason over context
- retrieve knowledge
- decide tool/reply
- return structured result

api:
- save agent run/tool execution/outbound message
- call wa-worker to send reply
```

### Reservation

```txt
ai-enggine:
- detect reservation intent
- collect slots
- call create reservation tool

api:
- validate tenant/customer/business rules
- create reservation
- create reminders
- persist audit/tool logs
```

### Order

```txt
ai-enggine:
- detect order intent
- collect items and fulfillment details
- call create order tool

api:
- validate products/prices
- create order and order items
- update customer metrics
- create payment follow-up reminder if needed
```

### Human Handoff

```txt
ai-enggine:
- detect escalation/failure/admin request
- call human handoff tool

api:
- set conversation humanTakeover=true
- create human_handoff
- notify admin

wa-worker:
- sends customer/admin messages only through API-triggered flow
```

### Knowledge Upload

```txt
web:
- upload document through API

api:
- store file metadata
- create knowledge_document
- call AI engine process/reindex

ai-enggine:
- extract text
- split chunks
- embed
- store FAISS index by business_id/document_id

api:
- persist document/chunk metadata
```

---

## 20. Acceptance Checklist

Before finishing a task, report:

* Files moved.
* Files created.
* Empty files filled.
* Existing code files intentionally not changed.
* Any generated files intentionally ignored.
* Any broken imports found and fixed.
* Whether `services/api` remains the only PostgreSQL owner.
* Whether `ai-enggine` and `wa-worker` still avoid direct DB access.
* Test/build/lint commands run and their results.
* Remaining TODOs that require implementation beyond the current task.

Final response format:

```txt
Changed:
- ...

Not changed:
- ...

Validation:
- ...

Remaining TODO:
- ...
```
