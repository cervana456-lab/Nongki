# services/ai-enggine

`services/ai-enggine` is the AI reasoning service for Ningki/Nongki. The folder name is intentionally spelled `ai-enggine`; commands and paths must use the actual folder name.

## Responsibilities

- Receive internal AI requests from `services/api`.
- Run FastAPI routers for health, onboarding, knowledge, tools, CRM assistant, and WhatsApp agent flows.
- Coordinate LangGraph agents, RAG retrieval, guardrails, and response generation.
- Keep local FAISS indexes under `app/storage`.
- Call `services/api` internal endpoints for business mutations and persistence.

## Boundaries

- No direct PostgreSQL access.
- No Prisma client or database driver usage.
- No WhatsApp transport runtime ownership.
- All tenant-scoped state must carry `business_id`.

## TODO

- Replace placeholder agent graphs, tools, RAG modules, and service classes in dedicated implementation tasks.
- Persist agent runs and tool executions through the internal API client once contracts are finalized.
