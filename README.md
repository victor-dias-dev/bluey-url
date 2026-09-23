# Bluey URL

[![CI](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml/badge.svg)](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Bluey URL is an open-source shortener. It creates links, redirects them from cache, and gives each account a dashboard for aliases, custom domains, and analytics.

The project is at [0.1.0](CHANGELOG.md). Redirects, accounts, and plan limits work. The analytics worker and DNS verification do not. That split is documented on purpose: the [roadmap](ROADMAP.md) is the list of ways to contribute.

[Português](README.pt-BR.md)

## Status

| Capability | State |
| --- | --- |
| Register, log in, and manage links | Works |
| `301` / `302` redirects, with expiration | Works |
| Redis cache that preserves status code and expiration | Works |
| Free-plan limit, paid custom aliases and domains | Works |
| Click analytics on the dashboard | The API shape exists. Clicks are queued and not stored yet. |
| Custom domain DNS verification | The expected TXT record is returned. The verify call responds with `501`. |

## Quick start

Requirements: Node.js 20 and Docker.

```bash
git clone https://github.com/victor-dias-dev/bluey-url.git
cd bluey-url
npm install
docker compose -f docker-compose.dev.yml up -d
cp backend/env.docker.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run prisma:migrate
npm run prisma:seed
```

In two terminals:

```bash
npm run dev:backend   # http://localhost:3000
npm run dev:frontend  # http://localhost:3001
```

The seed command creates `test@example.com` / `password123` for local use. Do not run it against a database you care about. Details are in [SECURITY.md](SECURITY.md).

Postgres is on `localhost:5432` (`bluey_user` / `bluey_password` / `bluey_url`). Redis is on `localhost:6379`.

## Common commands

| Command | What it does |
| --- | --- |
| `npm test` | Domain and configuration tests |
| `npm run lint` | Backend ESLint and Next.js lint |
| `npm run typecheck` | TypeScript in both packages |
| `npm run dev:backend` | API with reload |
| `npm run dev:frontend` | Dashboard |
| `npm run prisma:studio` | Database UI |

## Repository map

```
backend/     Fastify API, Prisma schema, domain rules
frontend/    Next.js dashboard
docs/        Architecture and business rules, matched to the code
```

Read [docs/architecture.md](docs/architecture.md) before changing the redirect path. The rules and their current status are in [docs/business-rules.md](docs/business-rules.md). Docker is covered in [DOCKER.md](DOCKER.md).

## Contributing

Issues and pull requests are welcome in English or Portuguese. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [roadmap](ROADMAP.md). Small pull requests that close a listed gap are the ones that get reviewed first.

Please report vulnerabilities through [private security advisories](https://github.com/victor-dias-dev/bluey-url/security/advisories/new), not through a public issue.

## License

[MIT](LICENSE)
