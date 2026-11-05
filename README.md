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
| `npm run build` | Guardrail lint, typecheck, client build, SSR build, pre-render of every page, sitemap and 404 page |
| `npm run preview` | Serve `dist/` locally |
| `npm run test:e2e` | Layout tests in a real browser at phone and desktop widths (run `npm run build` first) |
| `npm run extract` | Regenerate `src/content/resume.generated.json` from `resume/resume_us.typ` (also runs before `dev` and `build`) |
| `npm run resume` | Compile the three resume PDFs (PDF 2.0) into `public/resume/` (needs Typst 0.14 or newer) |

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

## Layout tests (phone and desktop)

`e2e/responsive.spec.ts` uses Playwright with the browser already installed on the machine (Edge on Windows, Chrome elsewhere; override with `PW_CHANNEL`). No browser download is needed.

```bash
npm run build
npm run test:e2e
```

At 360 and 390 px wide (touch emulation) it checks every main page, in English and Indonesian, for content that sticks out of the screen or is clipped, that the Resume tabs stay inside their container, that the menu opens, navigates and closes, that header buttons are at least 40 px, and that the architecture diagram is a readable list instead of a sideways-scrolling picture. At 1280 px it checks that the diagram is drawn as a picture. CI runs these tests before deploying.

To look at a phone layout yourself: run `npm run dev -- --host` and open the printed network address on your phone (same Wi-Fi), or use the device toolbar in the browser's developer tools.

## UI

Tailwind CSS v4 with shadcn/ui-style components (Radix primitives, `class-variance-authority`, `tailwind-merge`) in `src/components/ui/`. **Dark is the default**; only an explicit light choice (saved in `localStorage`) removes the `dark` class, and this happens before first paint. Theme tokens (oklch, zinc base with a blue primary) live in `src/styles/globals.css`. Fonts are Inter (UI) and JetBrains Mono (tags and code), self-hosted.

The components were written by hand. To add more from the shadcn registry, run `npx shadcn@latest add <component>`; `components.json` is already configured.

## Pre-rendering

`npm run build` renders every route in both languages (30 pages) to static HTML, so each page answers HTTP 200, carries its own `<title>`, description, canonical URL, `hreflang` and Open Graph tags, and shows content before JavaScript loads. The browser then hydrates the page.

- `src/entry-server.tsx` renders one route; `scripts/prerender.mjs` writes `dist/<route>/index.html`, `404.html` (an empty shell that the client router fills), `sitemap.xml` and `robots.txt`.
- `src/components/Seo.tsx` collects head data during the server render and keeps it in sync on client navigation.
- Scroll-reveal content stays visible in the HTML and without JavaScript; it is only hidden after the head script adds the `js` class to `<html>`.
- The demo's interactive panels need a Web Worker and IndexedDB, so they load on the client only; the page shell and its heading are pre-rendered.
- To add a page, add its route in `src/App.tsx` and its path in `src/entry-server.tsx` (`pages`). A test fails if a route does not provide metadata.

## Deploy

`https://ridhwanhabib18.github.io` is a **user site**, so the base path is `/` (no `VITE_BASE` needed).

1. Repository name must be exactly `ridhwanhabib18.github.io`.
2. Settings > Pages > Source: **GitHub Actions**.
3. Optional but recommended: add the repository secret `GUARDRAIL_BLOCKLIST` (comma-separated terms that must never be published). Without it CI only warns and skips the code-name scan; the generic rules still apply.
4. Push to `main`; `.github/workflows/deploy.yml` tests, builds and deploys.

Everything in a public repository, including its history, is readable. Review content before the first push.

## Resume PDFs

The resume source is `resume/resume_us.typ` (Typst). One file produces three variants, chosen with `--input role=senior|lead|analyst`. CI also passes `--input public=true`, which leaves the phone number and the work-authorization line out of the published PDFs.
PDFs are exported as **PDF 2.0** (`--pdf-standard 2.0`, Typst 0.14+), and the build fails if a file does not start with `%PDF-2.0`. Modern viewers (Acrobat, Chrome, Edge, Firefox, Preview) open PDF 2.0; some older viewers or applicant-tracking parsers may not. To use the widest-compatibility version instead, set `PDF_VERSION` to `'1.7'` in `scripts/build-resume.mjs`. See [`docs/resume-pdf-version.md`](docs/resume-pdf-version.md) for the reasoning and the trade-off.

- **CI:** `.github/workflows/deploy.yml` installs Typst, runs `npm run resume`, then builds the site, so `public/resume/ridhwan-habib-resume-<role>.pdf` is generated on every push and the Resume page links to it. The PDFs are build output and are not committed.
- **Locally:** install Typst 0.14 or newer (`winget install Typst.Typst`) and run `npm run resume`; the download buttons then work in `npm run dev` and `npm run preview`. Without the files, the download link returns 404 locally only.
- **Editing in VS Code:** the *Tinymist Typst* extension previews `resume/resume_us.typ` and can export PDF on save (`tinymist.exportPdf: "onSave"`).
- The resume text follows the same guardrails as the site (`npm run guardrail` scans `resume/`): percentages only, no currency or hour counts, descriptive system names.

## The resume source is the single source of truth

The website does not re-type resume content. `scripts/extract-resume.mjs` reads `resume/resume_us.typ` and writes `src/content/resume.generated.json`; the Resume, Experience, About and Contact pages and the Home stack and certifications read that file. The same Typst file produces the PDFs.

- **English** comes straight from the source. **Indonesian** comes from `src/content/resume.id.ts`, keyed by the exact English text. If the source text changes, a test fails until the translation is updated, and it also reports stale translations.
- **Not extracted, on purpose:** the phone number and the work-authorization line. In this public repository the `#let phone` line in `resume/resume_us.typ` is blank (the real number lives only in the private repository), and a test fails if a phone number appears in the source or in published content. When you copy the file from the private repository, blank that line first.
- **Case studies** (`src/content/projects.ts`) are richer than resume bullets and are written by hand, but they must not contradict or silently extend the resume. Each one names its resume bullet (`resumeBullet`). Tests fail if: a percentage is not in the Typst source; a per-project stack item (or a technology named in the text or diagram) is not in that system's resume bullet; or a number in the text is not in the bullet. Details that deliberately go beyond the resume (for example "capacity control" or "audit trail") are declared in `beyondResume`, and a test checks each declared detail is really in the case study and really absent from the resume.
- **Tech-stack chips** on the Experience page must be skills from the Typst source.
- Tests also fail if `resume.generated.json` is out of date; run `npm run extract` and commit the result.
- To change resume content: edit `resume/resume_us.typ`, run `npm run extract`, update any new strings in `resume.id.ts`, run `npm test`.

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
| Resume text (summaries, experience bullets, skills, education, certifications, contact links) | `resume/resume_us.typ`, then run `npm run extract` |
| Indonesian translation of that text | `src/content/resume.id.ts` (keyed by the exact English source string) |
| Resume variant labels on the site and PDF links | `src/content/resume.ts` |
| Availability badge | `available` in `src/content/profile.ts` |

## Not done yet

- Per-page Open Graph images and a custom domain.
- A reference ASP.NET Core API sample.
