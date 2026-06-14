# Tools

Tool code lives in `services/ai-enggine/app/tools`.

## Purpose

Tools are controlled action adapters for the AI engine. They translate agent decisions into internal HTTP calls to `services/api`.

## Rules

- Tools must not mutate PostgreSQL directly.
- Tools must include `business_id` for tenant-scoped actions.
- Tools must call `services/api` internal endpoints for orders, reservations, payments, reminders, handoff, notifications, customer updates, and audit persistence.
- Tool execution should be recorded through API-owned persistence once implementation starts.

## Current state

Most tool files intentionally return `not_implemented` placeholders. This foldering task does not replace them with business logic.

## TODO

- Bind each tool to a validated internal API contract.
- Add tests for auth headers, `business_id` propagation, and error handling.
