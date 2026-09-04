# FOSSLib — local setup

Full-stack catalogue of open source alternatives to proprietary apps.

Stack: React + Vite + TypeScript + Tailwind (frontend) · Express + Prisma + PostgreSQL (backend)

## 1. Database

Create a free Postgres instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com),
and copy the connection string.

## 2. Backend

```bash
cd backend
cp .env.example .env      # paste your DATABASE_URL in here
npm install
npm run prisma:migrate    # creates tables from prisma/schema.prisma
npm run dev                # runs on http://localhost:4000
```

Load starter data (6 categories, ~11 well-known proprietary apps, and their FOSS alternatives):

```bash
npm run prisma:seed
```

Or browse/edit data directly:

```bash
npm run prisma:studio
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend, so both need to be running.

## 4. Project structure

```
foss-lib/
├── backend/
│   ├── prisma/schema.prisma   # Category, ProprietaryApp, FossAlternative, Submission
│   └── src/
│       ├── index.ts           # Express app
│       └── routes/            # categories, apps, alternatives, submissions
└── frontend/
    └── src/
        ├── pages/              # Catalogue (browse/search) and Submit (new entry form)
        ├── components/         # Header, AppCard, FilterBar
        └── api/client.ts       # fetch wrapper for the backend
```

## 5. Next steps to build out

- Seed real categories + a handful of proprietary apps/alternatives so the catalogue isn't empty
- Admin view to approve/reject pending `Submission` rows (there's already a PATCH endpoint for it)
- Auth if you want submissions tied to accounts rather than anonymous
- Deploy: frontend → Vercel/Netlify, backend → Render/Railway, DB → Neon/Supabase
