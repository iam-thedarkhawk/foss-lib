# Contributing to FOSSLib

Welcome to FOSSLib! We're excited that you want to contribute. This guide will help you get started.

## Types of Contributions

You can contribute to FOSSLib in several ways:
- **Adding Alternatives:** Know a great FOSS alternative? Add it to our database.
- **Fixing Data:** Spot an error in an app's description or license? Submit a fix.
- **Improving UI/Code:** Enhance the website's design, fix bugs, or optimize the build script.
- **Reporting Bugs:** Found a broken link or an issue with the site? Open an issue.

## Step-by-Step: Adding or Editing an Alternative

1. **Fork the Repository:** Create a fork of this repository on GitLab/GitHub.
2. **Clone Locally:** `git clone https://gitlab.com/YOUR-USERNAME/fosslib.git`
3. **Edit YAML Files:** Find the appropriate category file in the `data/` directory.
4. **Commit Changes:** Write clear, concise commit messages.
5. **Create a Merge Request (MR):** Submit your changes for review.

## YAML Schema Reference

When adding an entry, ensure it matches this structure:

```yaml
- id: app-unique-id
  name: App Name
  description: A short description of the app.
  url: https://example.com
  license: MIT / GPLv3 / etc.
  repository: https://gitlab.com/example/repo
  platforms:
    - Windows
    - Linux
    - macOS
  tags:
    - tag1
    - tag2
  alternatives_to:
    # Contributing to FOSSLib

    FOSSLib is a React/Vite frontend backed by an Express API, Prisma, and PostgreSQL.
    Contributions are welcome for catalogue data, UI, backend behavior, documentation, and
    bug fixes.

    ## Ways to Contribute

    - Add or correct an open source alternative.
    - Improve the catalogue, submission form, or responsive layout.
    - Improve API routes, database behavior, validation, or error handling.
    - Report broken links, inaccurate data, or reproducible bugs.
    - Improve documentation and setup instructions.

    ## Adding Catalogue Data

    For permanent catalogue entries, edit the seed data in
    `backend/prisma/seed.ts`. Add an alternative to the relevant proprietary app's
    `alternatives` array:

    ```ts
    {
      name: "Example App",
      description: "A short description of the open source alternative.",
      license: "MIT",
      platforms: ["WINDOWS", "MACOS", "LINUX"],
      repoUrl: "https://github.com/example/app",
      website: "https://example.com",
      fitNotes: "Explain how closely it matches the proprietary app.",
    },
    ```

    Use the license and platform values defined in `backend/prisma/schema.prisma`.
    After editing the seed data, run:

    ```bash
    cd backend
    npm run prisma:seed
    ```

    The seed script is safe to run repeatedly: it upserts categories, apps,
    alternatives, and app-to-alternative links.

    The website's **Submit an alternative** form is intended for suggestions. It
    creates a `PENDING` submission for review and does not publish catalogue data
    automatically.

    ## Local Development

    Set up the project using [SETUP.md](SETUP.md). You need a PostgreSQL database and
    `backend/.env` containing a valid `DATABASE_URL`.

    Run the services in separate terminals:

    ```bash
    cd backend
    npm run dev
    ```

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend runs at `http://localhost:5173` and the API runs at
    `http://localhost:4000`.

    ## Guidelines

    - Only add projects with recognized open source licenses.
    - Verify repository, website, license, and platform information.
    - Keep descriptions concise and factual.
    - Explain important compatibility gaps in `fitNotes`.
    - Keep one alternative linked to each relevant proprietary app.
    - Avoid duplicate alternatives and preserve the existing data model.
    - Do not commit `.env` files or database credentials.

    ## Validation

    Before opening a pull request, run the checks for the area you changed:

    ```bash
    cd frontend
    npm run build
    ```

    ```bash
    cd backend
    npx prisma generate
    npm run build
    ```

    If you changed database schema or seed data, also run the migration or seed
    command against a development database and verify the relevant API response.

    ## Pull Requests and Bug Reports

    1. Fork or clone the repository and create a focused branch.
    2. Make the smallest change that solves the problem.
    3. Run the relevant validation commands above.
    4. Describe what changed and how it was tested.
    5. Open a merge request or pull request with a clear title.

    For bugs, include reproduction steps, expected behavior, actual behavior, and
    relevant logs without including secrets.
