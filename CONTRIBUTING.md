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
    - Proprietary App 1
```

## Guidelines

- **Truly Open Source:** Only add projects with recognized OSI-approved open-source licenses.
- **Accuracy:** Ensure the license, URL, and repository links are accurate and working.
- **Relevance:** Ensure the app fits the category it's placed in.

## Code Style Guidelines

- For Python code (`build.py`), follow PEP 8.
- For CSS/JS, keep it clean and formatted (4 spaces for indentation).
- Use semantic HTML.

## Pull Request Checklist

Before submitting your PR/MR, please check:
- [ ] You have followed the YAML schema for any data changes.
- [ ] You have tested the build locally using `python build.py`.
- [ ] Your code changes do not break existing functionality.
- [ ] You have read the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
