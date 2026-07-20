# services/api

Main backend and only PostgreSQL owner.

## Responsibilities

- Auth and workspace creation.
- Prisma schema, migrations, and database access.
- Tenant validation.
- Internal AI tool endpoints.
- Orders, reservations, payments, reminders, notifications, webhooks, and cron jobs.
- Agent run and tool execution persistence.
- WhatsApp metadata persistence.

## Rules

- Controllers stay thin.
- Services own business flow.
- Repositories own Prisma access.
- Every tenant-scoped query uses `businessId`.
- Internal routes require internal token middleware.
- Do not move AI reasoning or WhatsApp session runtime into this service.

## Related folders

- `services/api/src/modules`
- `services/api/src/clients`
- `services/api/src/middlewares`
- `services/api/prisma`
- `services/api/docs`

