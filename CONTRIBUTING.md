# Contributing to FOSSLib

Thank you for your interest in contributing to **FOSSLib**! 

FOSSLib is a community-driven, curated library catalogue helping individuals, developers, and organizations replace proprietary software with transparent, self-hostable, and ethical open-source tools.

Whether you are adding a new software alternative, refining feature comparisons, fixing bugs, or improving the vintage library catalogue UI, your contributions are welcome.

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
  - [1. Propose Alternatives via the Web Form (No Code)](#1-propose-alternatives-via-the-web-form-no-code)
  - [2. Add or Edit Catalogue Data via Code](#2-add-or-edit-catalogue-data-via-code)
  - [3. Improve Code, UI, or Backend Features](#3-improve-code-ui-or-backend-features)
- [Local Development Setup](#local-development-setup)
- [Catalogue Data Standards](#catalogue-data-standards)
  - [Alternative Criteria](#alternative-criteria)
  - [Supported Platforms & Licenses](#supported-platforms--licenses)
  - [Writing High-Quality Fit Notes](#writing-high-quality-fit-notes)
- [Design System & UI Guidelines](#design-system--ui-guidelines)
- [Submission & Review Process](#submission--review-process)
- [Pull Request Checklist](#pull-request-checklist)

---

## Ways to Contribute

### 1. Propose Alternatives via the Web Form (No Code)
If you don't want to touch git or code:
1. Start the app or visit the hosted site.
2. Navigate to **/submit** (`http://localhost:5173/submit`).
3. Fill in the proprietary app name, FOSS alternative, repository URL, category, and notes.
4. Submit! Your entry is placed in the curator review ledger (`/admin`) for approval.

### 2. Add or Edit Catalogue Data via Code
Direct data contributions live in:
📁 **`backend/prisma/seedData.json`**

To add or update an alternative:
1. Locate the appropriate category in `backend/prisma/seedData.json`.
2. Add or modify the proprietary application and its FOSS alternatives.
3. Validate and reload the database locally:
   ```bash
   npm run seed
   ```
4. Verify your change in the browser at `http://localhost:5173`.
5. Open a Pull Request!

### 3. Improve Code, UI, or Backend Features
We welcome improvements to:
- **Frontend**: React 18, TypeScript, Tailwind CSS, and client-side filtering.
- **Backend**: Express API routes, curation workflows, and Prisma ORM models.
- **Search & Discovery**: Enhancing indexing, tags, or fuzzy filtering.

---

## Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/iam-thedarkhawk/foss-lib.git
cd foss-lib

# Install all workspace dependencies (root, backend, frontend)
npm run install:all
```

### 2. Database Initialization
FOSSLib uses **SQLite** by default for zero-config local development:
```bash
# Sync database schema and populate 85+ starter catalogue entries
npm run db:push
npm run seed
```

*(Optional)* To view and edit the database records through Prisma's visual GUI:
```bash
npm run studio
```

### 3. Start Development Servers
Run both backend API (:4000) and frontend Vite server (:5173) concurrently:
```bash
npm run dev
```

- **Public Catalogue Browser**: [http://localhost:5173](http://localhost:5173)
- **Submit Form**: [http://localhost:5173/submit](http://localhost:5173/submit)
- **Curator Review Desk**: [http://localhost:5173/admin](http://localhost:5173/admin) (Default Passkey: `fosslib-curator-secret`)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

---

## Catalogue Data Standards

When adding software entries to `backend/prisma/seedData.json` or submitting via `/submit`, please ensure the entry meets our catalogue standards:

### Alternative Criteria
- **Must be genuinely Free and Open Source**: The software source code must be public and licensed under an OSI-approved or FSF-free software license (e.g. MIT, GPL, Apache, BSD, MPL, AGPL). "Free as in beer" freeware with closed source is not accepted.
- **Active & Usable**: The project should have active maintenance or be in a stable, functioning state.
- **True Functional Alternative**: The alternative must realistically fulfill the primary use cases of the commercial application it replaces.

### Supported Platforms & Licenses
Standard platform identifiers:
- `LINUX`
- `MACOS`
- `WINDOWS`
- `WEB`
- `ANDROID`
- `IOS`
- `SELF_HOSTED`

Common standardized licenses:
- `MIT`
- `GPL-2.0` / `GPL-3.0` / `GPL-3.0-or-later`
- `Apache-2.0`
- `MPL-2.0`
- `AGPL-3.0` / `AGPL-3.0-only`
- `BSD-3-Clause`

### Writing High-Quality Fit Notes
Fit notes give visitors practical context before migrating. Highlight:
- **Direct 1:1 Parity**: e.g., *"Reads/writes native .docx/.xlsx formats directly; strong drop-in replacement."*
- **Trade-offs & Missing Features**: e.g., *"Steeper learning curve; lacks cloud collaboration without self-hosting."*
- **Unique Advantages**: e.g., *"End-to-end encrypted, lightweight, local-first storage."*

---

## Design System & UI Guidelines

FOSSLib intentionally avoids generic modern tech themes in favor of an editorial, tactile **library catalogue index-card** aesthetic:

- **Color Palette**:
  - `paper`: `#F1ECDD` (warm library parchment)
  - `card`: `#FBF7EC` (cardstock)
  - `ink`: `#1F2A22` (deep dark green-black ink)
  - `pine`: `#28422F` (mid-tone accent)
  - `rust`: `#A34A28` (terracotta highlight)
  - `amber`: `#C08A2E` (warm amber indicator)
- **Typography**:
  - **Fraunces** (`font-display`): Editorial serif headings.
  - **Inter** (`font-body`): Clean, legible body text.
  - **IBM Plex Mono** (`font-mono`): Classification labels, stamps, badges, and metadata.
- **Components & Classes**:
  - Use `.catalogue-card` for card containers (crisp border + hard offset shadow `shadow-card: 2px 2px 0 0 #1F2A22`). Avoid soft modern blurs or rounded corners (`rounded-none`).
  - Use `.tag-pill` for license and platform pills.
  - Use `.stamp-button` for action links with physical hover tilt (`hover:-rotate-1`).

---

## Submission & Review Process

1. **Moderation Queue**:
   - Community submissions submitted through `/submit` land in the review desk with status `PENDING`.
2. **Reviewing Entries**:
   - Curators review pending proposals at `/admin`.
   - Access is protected by the `ADMIN_TOKEN` passkey configured in `backend/.env`.
   - Approving an entry automatically promotes it into the live catalogue database under its matched category.

---

## Pull Request Checklist

Before submitting a Pull Request, please ensure:

- [ ] Dependencies install cleanly: `npm run install:all`
- [ ] Both frontend and backend compile without errors: `npm run build`
- [ ] If modifying data: `npm run seed` succeeds and changes render properly in the browser
- [ ] If changing UI: tactile catalogue styling tokens (fonts, borders, offset shadows) are respected
- [ ] Commit messages are descriptive (e.g. `feat(data): add Penpot alternative for Figma` or `fix(api): handle missing category slug`)

Thank you for helping preserve and champion open-source software!
