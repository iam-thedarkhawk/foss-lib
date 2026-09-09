# FOSSLib — Free & Open Source Software Library Catalogue

A tactile, curated reference catalogue of open-source alternatives to proprietary and paid software.

FOSSLib adopts an editorial "library catalogue index-card" design system—featuring warm parchment backgrounds, hairline borders, hard offset shadows, Fraunces serif headings, and monospace metadata stamps.

---

## Features

- **Vintage Catalogue Aesthetic**: Inspired by traditional library card drawers and physical index files (`#F1ECDD` paper, `#1F2A22` ink, `#A34A28` rust accents, and tactile offset drop-shadows).
- **Dual Catalogue View**:
  - **FOSS Alternatives**: Browse standalone open-source tools, their licenses, platform availability, and star ratings.
  - **Proprietary Apps**: Find direct substitutes for commercial products (e.g., Photoshop → GIMP/Krita, Slack → Zulip/Mattermost, Notion → AppFlowy).
- **85+ Curated Entries Across 10 Categories**:
  - 📝 Office Suites
  - 🎨 Design & Graphics
  - 💬 Communication
  - ☁️ Cloud Storage
  - 💻 Development Tools
  - 🎵 Media & Editing
  - ✅ Productivity
  - 🔒 Security & Privacy
  - 🤖 AI & Machine Learning
  - 🐧 Operating Systems
- **Platform & License Filters**: Quick-filter by Linux, macOS, Windows, Web, Android, iOS, and Self-Hosted, with license pill tags (MIT, GPL-3.0, Apache-2.0, MPL-2.0, AGPL-3.0, etc.).
- **Detailed Record Cards (`/alternatives/:id`)**: Comprehensive views detailing compatibility notes, feature parity, official websites, and repository links.
- **Community Submission Form (`/submit`)**: Anyone can propose new alternatives with validation and notes.
- **Curator Workstation / Review Queue (`/admin`)**: Moderate submitted entries. Approving an entry automatically indexes it into the live database and catalogue.
- **Zero-Config Portability**: Pre-configured with SQLite for instant local execution without needing external cloud accounts or Docker.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6.
- **Backend**: Node.js, Express, TypeScript.
- **Database & ORM**: Prisma ORM with SQLite (zero-config local dev) and PostgreSQL readiness.

---

## Quickstart

### 1. Installation

From the project root:

```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Database Setup

The project includes an initialized and pre-seeded SQLite database (`backend/dev.db`) with 85+ alternatives.

If you ever want to re-seed or reset:

```bash
npm run seed
```

To browse or inspect records graphically:

```bash
npm run studio
```

### 3. Run Development Servers

Run both the backend API and frontend dev server with a single command:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Review Queue**: http://localhost:5173/admin

Alternatively, run them separately in different terminals:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

---

## Project Structure

```
fosslib/
├── package.json              # Root workspace runner & scripts
├── dev.mjs                   # Concurrent runner for backend + frontend
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                  # DATABASE_URL="file:./dev.db", PORT=4000
│   ├── prisma/
│   │   ├── schema.prisma     # Category, ProprietaryApp, FossAlternative, Submission
│   │   ├── seedData.json     # 85+ curated alternatives across 10 categories
│   │   └── seed.ts           # Populates categories, apps, alternatives & sample queue
│   └── src/
│       ├── index.ts          # Express API on :4000
│       ├── db.ts             # Prisma client instance
│       └── routes/
│           ├── categories.ts # Category routes
│           ├── apps.ts       # Proprietary apps routes
│           ├── alternatives.ts # FOSS alternatives routes
│           └── submissions.ts  # Community submission & approval workflow
└── frontend/
    ├── package.json
    ├── vite.config.ts        # Vite config with /api proxy to backend
    ├── tailwind.config.js    # Vintage catalogue color palette & shadow tokens
    ├── postcss.config.js
    ├── index.html            # Fraunces, Inter, IBM Plex Mono typography
    └── src/
        ├── index.css         # Catalogue card & stamp button styles
        ├── types.ts          # TypeScript interfaces
        ├── main.tsx          # App mount
        ├── App.tsx           # Layout & React Router
        ├── api/
        │   └── client.ts     # Fetch client for backend
        ├── components/
        │   ├── Header.tsx    # Masthead & navigation
        │   ├── Footer.tsx    # Editorial colophon & links
        │   ├── FilterBar.tsx # Debounced search, category & platform pills
        │   ├── AppCard.tsx   # Card for proprietary software
        │   └── AlternativeCard.tsx # Card for open-source tools
        └── pages/
            ├── Catalogue.tsx # Main browser index
            ├── AlternativeDetail.tsx # Deep-dive alternative view
            ├── Submit.tsx    # Contribution submission form
            └── Admin.tsx     # Submission triage & approval queue
```

---

## Contributing

1. Submit new alternatives directly via the `/submit` page in the application.
2. For code improvements, open a Pull Request on GitHub.

## License

MIT License.
