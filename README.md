# Sport Gear Store

Full-stack demo e-commerce application with a React frontend and a NestJS backend. PostgreSQL is the only runtime data source; the application no longer depends on commercetools.

## Structure

- `frontend` — React 19, Vite and Sass.
- `backend` — NestJS 11 REST API, Prisma 7 and PostgreSQL.
- `infra` — same-origin Nginx reverse proxy.

The public API is available under `/api/v1`. Swagger is exposed at `/api/docs` outside production.

## Requirements

- Node.js 24.15 or another Node 24 LTS release.
- npm 10+.
- PostgreSQL 17, or Docker for the provided Compose stack.

## Local development

```bash
nvm use
npm install
cp backend/.env.example backend/.env
docker compose up -d db
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Vite runs on `http://localhost:5173` and proxies `/api` to NestJS on port `3000`.
The Compose PostgreSQL service is exposed on host port `5433` by default; set
`POSTGRES_PORT` to override it.

## Production-like stack

```bash
docker compose up --build
docker compose run --rm migrate node --import tsx backend/prisma/seed.ts
```

Open `http://localhost:8080`. Nginx serves the SPA and proxies `/api` to NestJS under the same origin.

## Commands

- `npm run build` — build frontend and backend.
- `npm test` — run workspace tests.
- `npm run lint` — lint all workspaces.
- `npm run format:check` — verify formatting.
- `npm run db:migrate` — create/apply a development migration.
- `npm run db:seed` — idempotently seed demo catalog and promotions.

## Security model

- Access JWT and rotating refresh tokens are stored in HttpOnly cookies.
- Refresh tokens are persisted only as SHA-256 hashes.
- Mutating requests require `X-CSRF-Token`.
- Anonymous carts use a signed HttpOnly cookie and merge transactionally on login or registration.
- Passwords are hashed with Argon2id; secrets are never exposed through Vite variables.
