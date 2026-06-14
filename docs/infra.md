# Infra

Infrastructure layer.

## Current folder

- `infra/nginx`

## Rules

- Keep reverse proxy routes aligned with `docker-compose.yml`.
- Do not change infra unless a deployment, networking, or service exposure task requires it.
- Avoid hardcoded local machine paths.

