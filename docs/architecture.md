# Architecture

Bluey URL is a monolith with two deployable surfaces: a Fastify API and a Next.js dashboard. This document describes the code in the repository, not a future deployment.

## Request paths

```
Browser
  ├─ dashboard (Next.js) ── /api/* ──► Fastify ──► PostgreSQL
  └─ short link ────────── /:code ──► Fastify ──► Redis, then PostgreSQL
                                              └─► BullMQ (click event)
```

There is no analytics worker. Jobs are enqueued and currently sit in Redis. See the [roadmap](../ROADMAP.md).

## Redirect

1. `GET /:shortCode` ignores reserved names (`health`, `api`, and anything under `api`).
2. The host header selects a verified custom domain. `localhost` uses the default namespace.
3. The handler reads `short:{domainId|default}:{code}` from Redis.
4. On a miss, it loads an active row from PostgreSQL and writes the cache.
5. The cache value is JSON: destination, `301` or `302`, and an optional expiration. Older entries that stored a bare URL are still accepted and treated as a permanent redirect with no expiration.
6. The cache TTL is 24 hours or the time remaining until expiration, whichever is smaller. An expired cached entry is deleted and answered with `410`.
7. A click is published after the decision to redirect. A cache or queue failure is logged and does not block the response.

Inactive links are removed from the cache when they are updated or soft-deleted.

## Plans

| Plan | Active links | Custom alias | Custom domain |
| --- | --- | --- | --- |
| FREE | 10 | No | No |
| PRO | Unlimited | Yes | Yes |
| ENTERPRISE | Unlimited | Yes | Yes |

The rules live in `backend/src/domain/plans.ts` and are enforced by the API.

## What is intentionally simple

- One Fastify process serves both the management API and the redirect.
- PostgreSQL stores users, domains, links, and click rows. Click rows are unused until a worker exists.
- Redis is both the redirect cache and the BullMQ connection. The two uses do not share a client: BullMQ needs `maxRetriesPerRequest: null`, and the cache client fails fast instead.
- Authentication is a JWT signed with `JWT_SECRET`. Passwords are hashed with bcrypt.

## Modules

| Path | Responsibility |
| --- | --- |
| `backend/src/domain` | Pure rules and their tests |
| `backend/src/routes` | HTTP adapters |
| `backend/src/services/analytics.ts` | Queue producer |
| `frontend/src` | Dashboard |

Start with the domain tests if you want to understand a rule without running the databases.
