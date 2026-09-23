# Backend

Fastify API for Bluey URL. The product overview is in the [repository README](../README.md). Behavior that does not match this file is a bug.

## Setup

```bash
cp env.docker.example .env   # Postgres and Redis from docker-compose.dev.yml
npm install
npm run prisma:migrate
npm run prisma:seed          # local user: test@example.com / password123
npm run dev
```

`env.example` is the annotated list of variables. `CORS_ORIGIN` is optional in development. `DOMAIN_AUTO_VERIFY=true` marks domains verified without DNS, and only when `NODE_ENV` is not `production`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Reload on change |
| `npm test` | Pure rules in `src/domain` and `src/config` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Compile to `dist/` |

## HTTP API

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Liveness |
| `POST` | `/api/auth/register` | No | Password of at least 8 characters |
| `POST` | `/api/auth/login` | No | |
| `GET` | `/api/auth/me` | Yes | |
| `POST` | `/api/urls` | Yes | Enforces plan limits |
| `GET` | `/api/urls` | Yes | |
| `GET` | `/api/urls/:id` | Yes | |
| `PATCH` | `/api/urls/:id` | Yes | |
| `DELETE` | `/api/urls/:id` | Yes | Soft delete and cache eviction |
| `GET` | `/api/domains` | Yes | |
| `POST` | `/api/domains` | Yes | Paid plans. Returns the TXT record to publish. |
| `POST` | `/api/domains/:id/verify` | Yes | `501` until DNS checks exist |
| `DELETE` | `/api/domains/:id` | Yes | Refuses when the domain still has links |
| `GET` | `/api/analytics/urls/:urlId` | Yes | Empty until a worker writes clicks |
| `GET` | `/api/analytics/urls/:urlId/clicks` | Yes | `limit` is clamped to 1–100 |
| `GET` | `/:shortCode` | No | `301`, `302`, `404`, or `410` |

Invalid JSON bodies return `400` with `error: "Validation failed"`.

## Layout

```
src/domain     rules without I/O, plus tests
src/routes     HTTP
src/services   BullMQ producer
prisma         schema, migrations, seed
```
