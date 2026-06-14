# Agents

Agent code lives in `services/ai-enggine/app/agents`.

## Current packages

- `onboarding_agent`
- `knowledge_agent`
- `whatsapp_customer_agent`
- `crm_assistant_agent`

## Intended flow

```txt
load context
-> classify intent
-> retrieve business-scoped knowledge
-> decide reply or controlled tool action
-> return structured result to services/api
```

## Rules

- Agent state must include `business_id`.
- Agents may reason and recommend, but write actions must go through tools that call `services/api`.
- Do not add database access in agents.
- Existing graph and node placeholders are intentionally not implemented in this foldering task.

## TODO

- Define concrete LangGraph state transitions.
- Add tests for tenant-scoped state propagation before enabling production flows.
