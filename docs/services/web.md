# apps/web

SvelteKit frontend.

## Responsibilities

- Landing and static pages.
- Auth UI.
- Dashboard UI.
- Product, pricing, solution, and workflow pages.
- Calls `services/api` through HTTP.

## Rules

- No database access.
- No internal tokens in browser code.
- Preserve `src/lib/components/ui` as UI primitives.
- Keep static pages minimal and workflow-focused.

## Related folders

- `apps/web/src/routes`
- `apps/web/src/lib/components`
- `apps/web/src/lib/constants`
- `apps/web/src/lib/auth`
- `apps/web/src/lib/providers`

