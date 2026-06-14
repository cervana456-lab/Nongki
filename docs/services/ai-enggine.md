# services/ai-enggine

AI reasoning service. The folder name is intentionally `ai-enggine`; do not rename it without a dedicated migration.

## Responsibilities

- FastAPI routers.
- LangGraph agents.
- Intent classification.
- RAG retrieval.
- Tool planning.
- Guardrails.
- Response generation.
- Local FAISS index management.

## Rules

- No direct PostgreSQL access.
- All tools call `services/api` internal endpoints.
- Every agent state carries `business_id`.
- Every RAG query is filtered by `business_id`.
- Existing placeholders are not implementation-ready yet.

## Related folders

- `services/ai-enggine/app/api`
- `services/ai-enggine/app/agents`
- `services/ai-enggine/app/rag`
- `services/ai-enggine/app/services`
- `services/ai-enggine/app/tools`
- `services/ai-enggine/app/storage`

