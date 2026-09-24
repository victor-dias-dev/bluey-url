# Contributing

Thanks for considering a contribution. Bluey URL is early, and the most useful help is a small, reviewed change against a documented gap. Issues and pull requests are welcome in English or Portuguese.

## Before you start

1. Look at the [roadmap](ROADMAP.md). Work that is already listed is easier to review than a surprise rewrite.
2. Open an issue before a large change. A bug fix or a docs correction can go straight to a pull request.
3. Do not open a pull request that adds a new product surface (billing, teams, a new database) without an issue that describes who it is for.

## Local setup

Requirements: Node.js 20, Docker, and npm 10.

```bash
npm install
docker compose -f docker-compose.dev.yml up -d
cp backend/env.docker.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run prisma:migrate
npm run prisma:seed
npm run dev:backend
npm run dev:frontend
```

The seed user is `test@example.com` / `password123`. It is for local development only.

## Checks

Run these before you push:

```bash
npm test
npm run lint
npm run typecheck
```

CI runs the same commands. A pull request needs them green.

## How the code is organized

Business rules that do not need Postgres or Redis live in `backend/src/domain`. Put new rules there and add a test next to them. Route handlers should stay thin: validate input, call the database, and translate a decision into an HTTP status.

Do not claim a behavior in the README until a test or the running code actually does it. The roadmap is the place for intended work.

## Pull requests

- Explain the user-visible change and how you verified it.
- Keep the diff limited to the issue you are solving.
- Prefer a follow-up PR over expanding the current one.
- Commit messages should say what changed and why.

## Reports

- Security vulnerabilities: see [SECURITY.md](SECURITY.md). Do not file a public issue.
- Everything else: use the issue templates.
