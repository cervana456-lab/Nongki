# Environment

The AI engine should read environment from the monorepo root `.env` or deployment-injected variables.

## Common variables

- `AI_ENGINE_PORT`: FastAPI service port.
- `API_URL`: base URL for `services/api`.
- `INTERNAL_API_TOKEN`: shared internal service token.
- `REDIS_URL`: Redis connection for cache, locks, or queues.
- `RABBITMQ_URL`: RabbitMQ connection for command consumers.
- `EVENT_PRODUCER_AI`: event producer name, conceptually `services/ai-enggine`.

## Rules

- Do not store secrets in source files.
- Do not expose internal tokens to `apps/web`.
- Keep path references pointed at `services/ai-enggine`.
- FAISS and temporary files belong under `services/ai-enggine/app/storage`.

## TODO

- Document provider-specific LLM and embedding variables when the LLM factory is implemented.
