# Roadmap

This list is the public contract for what is next. A feature is not "done" because it is written here. Take an item, open an issue, and keep the pull request smaller than the item if you need to.

## Good first contributions

- Add an OpenAPI description for the routes in `backend/src/routes`.
- Cover the auth and URL handlers with tests that use Fastify's `inject` and a test database.
- Replace the grouped-by-exact-timestamp analytics query with a daily bucket. The current query does not actually aggregate by day.
- Add a frontend test for the login form and the create-URL dialog.
- Document a production deployment that does not publish Postgres and Redis to the public internet.

## Product gaps

- **Analytics worker.** `publishClickEvent` enqueues a BullMQ job and nothing consumes it, so the dashboard has no click data. The worker should parse the user agent, persist a `ClickEvent`, and stay off the redirect path.
- **DNS verification.** `POST /api/domains/:id/verify` returns 501. It should look up the TXT record described in the create response and only then set `verified`.
- **Abuse controls.** Block obviously dangerous destinations, add a per-account create limit that is stricter than the global rate limit, and decide what a preview page should look like.
- **Idempotent migrations in production.** The image starts the API and does not run `prisma migrate deploy`.

## Explicitly out of scope until the items above exist

Billing, team accounts, a second analytics database, and Kubernetes. Adding them now makes the project look larger without making the shortener more trustworthy.
