# services/wa-worker

WhatsApp gateway service.

## Responsibilities

- Baileys session lifecycle.
- QR generation.
- Message normalization.
- Outbound message sending.
- Forward inbound events to `services/api`.

## Rules

- No direct PostgreSQL access.
- No AI reasoning.
- No heavy business logic.
- Use idempotency for message handling.
- Internal calls require internal token.

## Related folders

- `services/wa-worker/src/whatsapp`
- `services/wa-worker/src/modules/sessions`
- `services/wa-worker/src/modules/messages`
- `services/wa-worker/src/consumers`
- `services/wa-worker/src/infra`

