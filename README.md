# Bluey URL

[Português](README.pt-BR.md)

[![CI](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml/badge.svg)](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Open-source URL shortener. A short code resolves from Redis, falls back to PostgreSQL, and redirects with `301` or `302`. Each account has a dashboard for links, aliases, and custom domains.

A short code is unique per domain. A click is published to a queue and does not block the redirect. The worker that stores those clicks, and the DNS check for a custom domain, are still open. See [ROADMAP.md](ROADMAP.md).

![URLs](docs/screenshots/urls.png)
![Dashboard](docs/screenshots/dashboard.png)
![Settings](docs/screenshots/settings.png)

## What is in the app

- Register, login, and account settings
- Short links, custom aliases on paid plans, expiration, and `301` / `302`
- Custom domains on paid plans
- Dashboard
- Analytics endpoints for clicks, once a worker persists the queued events

## Requirements

- Node.js 20
- npm 10
- Docker and Docker Compose

## Quick start

```bash
npm install
docker compose -f docker-compose.dev.yml up -d
cp backend/env.docker.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

In two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The seed user is `test@example.com` / `password123`.

The API listens on http://localhost:3000. Health: `GET /health`. The dashboard listens on http://localhost:3001.

The API warns in production when `JWT_SECRET` is still a placeholder. Copy the examples and keep real secrets out of git.

| Variable                  | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `NODE_ENV`                | `development`, `test`, or `production`               |
| `PORT`                    | HTTP port                                            |
| `DATABASE_URL`            | PostgreSQL                                           |
| `REDIS_URL`               | Redis                                                |
| `JWT_SECRET`              | JWT secret                                           |
| `JWT_EXPIRES_IN`          | Access token lifetime (`7d`, `1h`)                   |
| `CORS_ORIGIN`             | Allowed origins (every origin in development)        |
| `DOMAIN_AUTO_VERIFY`      | Skip DNS locally. Ignored when `NODE_ENV=production` |

On the dashboard, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` when the API is not on `http://localhost:3000`.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build:backend
npm run build:frontend
```

## Repository

```text
backend/     Fastify API, Prisma schema, domain rules
frontend/    Next.js dashboard
docs/        Architecture, business rules, and screenshots
```

Redirect path: [docs/architecture.md](docs/architecture.md). Rules and what is enforced today: [docs/business-rules.md](docs/business-rules.md). Docker: [DOCKER.md](DOCKER.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports go through [private vulnerability reporting](https://github.com/victor-dias-dev/bluey-url/security/advisories/new), described in [SECURITY.md](SECURITY.md).

Licensed under the [MIT License](LICENSE).
