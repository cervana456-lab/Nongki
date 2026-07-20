# Database Flow

## Ownership

- `apps/web`: only uses REST API.
- `services/api`: only direct PostgreSQL owner through Prisma.
- `services/ai-enggine`: internal HTTP to API plus local FAISS storage.
- `services/wa-worker`: internal HTTP to API, no DB access.

## Rule

No service except `services/api` may access PostgreSQL directly. All business mutations go through `services/api`.

Tenant-scoped reads and writes must carry `businessId` or `business_id`, and API ownership validation must happen before persistence.

## Core flows

1. Register and workspace creation.
2. Onboarding.
3. Knowledge upload and reindex.
4. WhatsApp connect.
5. Incoming customer message.
6. AI reply and tool execution.
7. Reservation.
8. Order.
9. Payment.
10. Human handoff.
11. Reminder cron.
12. Spreadsheet sync.

## Runtime path

```txt
Customer WhatsApp
-> services/wa-worker
-> services/api
-> services/ai-enggine
-> LangGraph agent
-> controlled internal tool call
-> services/api
-> PostgreSQL
-> services/api
-> services/wa-worker
-> WhatsApp customer
```

