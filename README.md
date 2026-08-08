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

## Vercel + Neon deployment

The repository contains `vercel.json` and one `Dockerfile.vercel` per workspace. Vercel
Services deploys both containers under one origin: `/api/*` is routed to NestJS and all
other paths are routed to the React SPA. The Services framework is currently a Vercel
beta feature, so enable it in the project's Build and Deployment settings before the
first deployment.

### 1. Create the database

Create a PostgreSQL project in [Neon](https://neon.tech/), copy its pooled connection
string and keep it private. The connection string is used as `DATABASE_URL`; do not put
it in the repository or in a `VITE_*` variable.

### 2. Configure the Vercel project

Import this repository as one Vercel project with the repository root (`.`) as the Root
Directory and select `Services` as the Framework Preset. Add these variables for the
Production environment (and separate values for Preview if needed):

```text
NODE_ENV=production
DATABASE_URL=postgresql://...        # Neon pooled URL
JWT_ACCESS_SECRET=<at least 32 random characters>
COOKIE_SECRET=<at least 32 random characters>
FRONTEND_ORIGIN=https://<your-domain>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_DAYS=30
```

Do not set `PORT`: Vercel injects the port used by the container. `VITE_API_BASE_URL`
remains `/api/v1`, so browser requests and authentication cookies stay same-origin.

### 3. Apply migrations and seed demo data

Vercel builds the image but does not change the database schema automatically. Run the
release step from a machine with the Neon URL in its environment, then deploy the
project:

```bash
DATABASE_URL="<neon-pooled-url>" npm run prisma:deploy --workspace backend
DATABASE_URL="<neon-pooled-url>" npm run db:seed
npx vercel deploy
```

Migrations are idempotent and should be run once per database before the first release.
Keep the Neon URL and application secrets in Vercel Environment Variables or a local
untracked `.env` file only.

## Commands

- `npm run build` — build frontend and backend.
- `npm test` — run workspace tests.
- `npm run test:e2e` — run the API integration flow against the configured PostgreSQL database.
- `npm run test:smoke` — build the app and run the Playwright Chromium smoke test (install once with
  `npx playwright install chromium`).
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
