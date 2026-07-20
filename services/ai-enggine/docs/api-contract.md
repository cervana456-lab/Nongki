# API Contract

This service is called internally by `services/api`, and its tools call `services/api` internal endpoints.

## Incoming direction

```txt
services/api -> services/ai-enggine
```

Expected use cases:

- Run WhatsApp customer agent.
- Process onboarding context.
- Process or reindex knowledge documents.
- Run controlled tool planning.

## Outgoing direction

```txt
services/ai-enggine -> services/api
```

Expected use cases:

- Read business context, customer profile, and conversation history.
- Execute controlled tools for orders, reservations, reminders, handoff, notifications, and payments.
- Record agent runs and tool executions once persistence contracts are implemented.

## Rules

- Use internal token authentication for service-to-service calls.
- Include `business_id` in tenant-scoped requests.
- Do not bypass `services/api` for business mutations.
- Keep response contracts structured enough for API persistence and audit logs.

## TODO

- Replace `not_implemented` responses with contract-backed implementations in separate API/AI integration tasks.
