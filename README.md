# Portfolio site

Portfolio of Muhammad Ridhwan Habib Abdillah, Full Stack .NET Engineer.
React + TypeScript + Vite static site hosted on GitHub Pages at <https://ridhwanhabib18.github.io>. English by default, with an Indonesian version under `/id`. Dark theme by default.

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5180
```

Cepat (Bahasa Indonesia): jalankan `npm install`, lalu `npm run dev`, dan buka http://localhost:5180.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload on port 5180 (fixed, `strictPort`) |
| `npm test` | Content, guardrail, demo and render tests |
| `npm run build` | Guardrail lint, typecheck, production build, GitHub Pages helpers |
| `npm run preview` | Serve `dist/` locally |

## Run automatically in VS Code

`.vscode/tasks.json` starts the dev server (after `npm install`) whenever the folder is opened, and `.vscode/launch.json` opens the site in a browser.

1. Open the folder in VS Code. When prompted, choose **Allow Automatic Tasks** (or run **Tasks: Manage Automatic Tasks in Folder** and pick **Allow**). VS Code never runs automatic tasks without this one-time approval.
2. The task **Portfolio: dev server** opens in its own terminal panel and prints `Local: http://localhost:5180/`.
3. Open the page, either:
   - press **F5** and choose **Portfolio: open in Edge (server already running)**, which opens Edge with the debugger attached, or
   - run **Simple Browser: Show** from the Command Palette (`Ctrl+Shift+P`) and enter `http://localhost:5180` to view it inside VS Code, or
   - `Ctrl+Click` the link in the terminal.
4. Use **Portfolio: start server and open in Edge** when the server is not running yet. Stop the server first if it is already running from the automatic task.

Run the other tasks from **Terminal > Run Task**: `Portfolio: test` and `Portfolio: build`.

Notes:
- To stop the automatic start, delete the `"runOptions": { "runOn": "folderOpen" }` block from the dev server task, or choose **Tasks: Manage Automatic Tasks in Folder > Disallow**.
- If port 5180 is busy, Vite stops with an error instead of switching ports, so the launch configurations stay correct. Free the port or change it in `vite.config.ts` and `.vscode/launch.json`.

### Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Edge opens an error page and the debug console shows `Could not read source map for chrome-error://...` | The page could not connect, so the dev server is not running. Start it (**Terminal > Run Task > Portfolio: dev server**), wait for `Local: http://localhost:5180/`, then launch again. The source-map message itself is harmless noise from the error page. |
| The server does not start when the folder opens | Automatic tasks are not approved. Run **Tasks: Manage Automatic Tasks in Folder**, choose **Allow**, and reopen the folder. |
| `Port 5180 is already in use` | Another process owns the port. Close it, or change the port in `vite.config.ts` and `.vscode/launch.json`. |
| F5 asks that the task is already active | The automatic task is already running. Use the "server already running" launch configuration instead. |

## UI

Tailwind CSS v4 with shadcn/ui-style components (Radix primitives, `class-variance-authority`, `tailwind-merge`) in `src/components/ui/`. **Dark is the default**; only an explicit light choice (saved in `localStorage`) removes the `dark` class, and this happens before first paint. Theme tokens (oklch, zinc base with a blue primary) live in `src/styles/globals.css`. Fonts are Inter (UI) and JetBrains Mono (tags and code), self-hosted.

The components were written by hand. To add more from the shadcn registry, run `npx shadcn@latest add <component>`; `components.json` is already configured.

## Deploy

`https://ridhwanhabib18.github.io` is a **user site**, so the base path is `/` (no `VITE_BASE` needed).

1. Repository name must be exactly `ridhwanhabib18.github.io`.
2. Settings > Pages > Source: **GitHub Actions**.
3. Add the repository secret `GUARDRAIL_BLOCKLIST` (comma-separated terms that must never be published). The CI build fails without it.
4. Push to `main`; `.github/workflows/deploy.yml` tests, builds and deploys.

Everything in a public repository, including its history, is readable. Review content before the first push.

## Content guardrails

`npm run guardrail` (also part of `npm run build` and of the tests) fails on currency figures, absolute hour counts and any term in the blocklist.
The blocklist comes from the `GUARDRAIL_BLOCKLIST` environment variable or an untracked `blocklist.local.txt`, never from committed files.
Every metric must be labelled `actual` or `target`.

## Content

All content is typed data in `src/content/` with `{ en, id }` for every user-facing field. Interface strings are in `src/i18n/strings.ts`; a test checks that both languages have the same keys.

| To change | Edit |
|---|---|
| Name, links, about, stack, certifications | `src/content/profile.ts` |
| Case studies, metrics, diagrams | `src/content/projects.ts` |
| Experience timeline | `src/content/experience.ts` |
| Resume variants and PDF links | `src/content/resume.ts` (set `pdf` to e.g. `resume/lead.pdf` after adding the PDF to `public/resume/`) |
| Availability badge | `available` in `src/content/profile.ts` |

## Not done yet

- Static pre-rendering per route (the site is a client-rendered SPA with a `404.html` fallback; per-page metadata is set at runtime).
- Per-page Open Graph images and a custom domain.
- A reference ASP.NET Core API sample.
- Resume PDFs (add the compiled files, then set `pdf` in `resume.ts`).
