# Frontend

Next.js 14 dashboard for Bluey URL. It talks to the API in `backend/`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:3000`. `npm run dev` serves the dashboard on port 3001 so it does not collide with the API.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run lint` | `next lint` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |

## Layout

```
src/app            routes: auth and dashboard
src/components     UI, including the shadcn/ui primitives in components/ui
src/hooks          React Query hooks per resource
src/services/api.ts  HTTP client
```

Custom aliases are validated in the create dialog and rejected by the API on the Free plan. Domain verification stays unavailable until the backend implements DNS checks.
