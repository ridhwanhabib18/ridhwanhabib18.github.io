# Portfolio site

Portfolio of Muhammad Ridhwan Habib Abdillah, Full Stack Software Engineer (.NET).
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
| `npm test` | Content, guardrail and render tests |
| `npm run build` | Guardrail lint, typecheck, client build, SSR build, pre-render of every page, sitemap and 404 page |
| `npm run preview` | Serve `dist/` locally |
| `npm run lighthouse` | Lighthouse scores for 9 pages on phone and desktop (run `npm run build` first; fails below `LH_MIN`, default 90) |
| `npm run translations` | Writes `docs/translation-review.md`: every English text next to its Indonesian translation, for a native speaker to review |
| `npm run icons` | Regenerates the favicon and the PNG app icons from the site mark, and a comparison picture `docs/brand-preview.png` |
| `dotnet test reference-api` | Tests of the ASP.NET Core reference API (needs the .NET 10 SDK) |
| `npm run test:e2e` | Browser tests: phone and desktop layout, share images and profile photo (run `npm run build` first) |
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

## Quality targets explained: Lighthouse 95+ and WCAG AA

These two names appear in the project goals. This section explains them in plain language.

### Lighthouse

**What it is.** A free, automated audit tool from Google. It is built into Chrome and Edge (DevTools, tab *Lighthouse*), and this repository can run it from the command line: `npm run build && npm run lighthouse`. It opens a page, measures it, and gives a score from 0 to 100 in four categories:

| Category | What it measures |
|---|---|
| **Performance** | How fast the page appears and becomes usable, tested on a simulated mid-range phone with a slow connection |
| **Accessibility** | Whether people with visual, motor or other limitations, and screen readers, can use the page (the automated part) |
| **Best Practices** | Basic safety and good web practice (HTTPS, no console errors, modern APIs) |
| **SEO** | Whether search engines can read and understand the page (title, description, links, mobile friendly) |

**What "95+" means.** The project goal is a score of at least 95 out of 100 in each category. Lighthouse colours 90 to 100 green ("good"), 50 to 89 orange and below 50 red.

**The Performance numbers (Core Web Vitals) in plain words:**

| Metric | Plain meaning | "Good" is |
|---|---|---|
| **FCP**, First Contentful Paint | When the first text or image appears | up to 1.8 s |
| **LCP**, Largest Contentful Paint | When the biggest piece of content (usually the headline or hero image) is shown | up to 2.5 s |
| **TBT**, Total Blocking Time | How long JavaScript keeps the page from reacting to taps and clicks | up to 200 ms |
| **CLS**, Cumulative Layout Shift | How much the content jumps around while loading (a late font or image pushing text down) | up to 0.1 |

**Limits to remember.** It is a laboratory test, not real visitors, and one page at a time. Scores move a few points from run to run, so repeat a low result before acting on it. A high score does not guarantee a good site, but a low one points to something real.

### WCAG AA

**What it is.** WCAG (*Web Content Accessibility Guidelines*) is the international standard, published by the W3C, for making web content usable by everyone, including people who are blind, have low vision, cannot use a mouse, are colour-blind, or use a screen reader. It has versions (2.0, 2.1, 2.2; this project targets **2.2**) and three conformance levels:

- **A**: the minimum. Without it some people cannot use the page at all.
- **AA**: the level normally required in laws, contracts and procurement (for example the European Accessibility Act). **This is the project goal.**
- **AAA**: the strictest, usually not required for a whole site.

Everything is organised under four principles, **POUR**: Perceivable, Operable, Understandable, Robust.

**Rules of level AA that matter most here:**

| Rule | In plain words | How this site meets it |
|---|---|---|
| **Contrast** (1.4.3) | Text must stand out from its background: ratio at least **4.5:1** (3:1 for large text) | Theme colours are chosen and checked in both the dark and the light theme |
| **Keyboard** (2.1.1) and **focus visible** (2.4.7) | Everything works without a mouse, and you can always see where you are | Skip link, focus rings, menu and tabs work with the keyboard |
| **Text alternatives** (1.1.1) | Images have a text description | The photo has a description; decorative icons are hidden from screen readers |
| **Not only colour** (1.4.1) | Meaning is never carried by colour alone | "Actual" and "Target" badges also say the word |
| **Labels** (3.3.2, 4.1.2) | Form fields and buttons have names a screen reader can read | Fields have labels; icon buttons have names |
| **Headings and structure** (1.3.1, 2.4.6) | Headings go in order (h1, h2, h3) and lists are real lists | Checked automatically |
| **Reflow and zoom** (1.4.10, 1.4.4) | Works at 320 px width and at 200% zoom without sideways scrolling | Layout tests at 360 and 390 px |
| **Target size** (2.5.8, new in 2.2) | Tap targets are at least 24 px (this site uses 40 px on phones) | Header buttons are 40 px on phones |
| **Reduced motion** (2.3.3 and good practice) | Animations stop for people who ask the system for less motion | Animations are switched off for `prefers-reduced-motion` |

**How this repository checks it.**
1. **axe** (an open-source accessibility engine, the same one Lighthouse uses) runs in `e2e/quality.spec.ts` on 19 pages, in the dark and the light theme, against the WCAG 2.0, 2.1 and 2.2 level A and AA rules. A violation fails the test and therefore the deploy.
2. **Lighthouse** gives an Accessibility score (the same engine, a smaller rule set).
3. **By hand**, now and then: press Tab through every page without a mouse, zoom to 200%, and listen to one page with a screen reader (NVDA on Windows is free).

**What automation cannot catch.** Tools find roughly a third to a half of accessibility problems. They cannot judge whether an image description is meaningful, whether the focus order makes sense, or whether the wording is easy to understand. So "no axe violations" is a strong sign, not a certificate of WCAG AA conformance.

### Ringkasan dalam Bahasa Indonesia

- **Lighthouse** adalah alat audit otomatis gratis dari Google (ada di Chrome dan Edge). Ia memberi skor 0 sampai 100 untuk **Performance** (kecepatan), **Accessibility** (bisa dipakai semua orang), **Best Practices** (praktik web yang baik), dan **SEO** (mudah dipahami mesin pencari). **"95+"** artinya target kita adalah nilai minimal 95 di keempatnya. Skor 90 ke atas sudah hijau (bagus).
- Angka kecepatan yang penting: **LCP** (kapan konten terbesar tampil, bagus ≤ 2,5 detik), **TBT** (berapa lama halaman "macet" karena JavaScript, bagus ≤ 200 ms), dan **CLS** (seberapa banyak tampilan melompat saat memuat, bagus ≤ 0,1).
- Hasilnya adalah uji laboratorium pada HP simulasi, bukan pengunjung asli, dan bisa naik turun beberapa poin tiap dijalankan.
- **WCAG** adalah standar internasional agar web bisa dipakai semua orang, termasuk tunanetra, pengguna keyboard saja, buta warna, dan pembaca layar. Tingkatnya **A** (minimum), **AA** (yang biasa diwajibkan hukum dan kontrak, **target kita**), dan **AAA** (paling ketat). Versi yang kita pakai adalah **2.2**.
- Contoh aturan AA: kontras teks minimal **4,5 banding 1**, semua fungsi bisa dipakai tanpa mouse, gambar punya deskripsi, makna tidak hanya lewat warna, dan tombol cukup besar untuk disentuh.
- Di proyek ini, **axe** memeriksa 19 halaman di tema gelap dan terang pada setiap build. Itu tanda kuat, tetapi bukan sertifikat: alat otomatis hanya menangkap sekitar sepertiga sampai separuh masalah, jadi sesekali tetap perlu dicoba manual (Tab saja tanpa mouse, zoom 200%, pembaca layar).

### Latest measurement

Measured with `LH_RUNS=3 npm run lighthouse` (median of 3) on the built site after the animation work (2026-11-06, Edge, simulated mid-range phone for "mobile"):

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| **Desktop**, all 9 pages | 100 | 100 | 100 | 100 |
| **Mobile**, all 9 pages | 98 to 100 (home page 100) | 100 | 100 | 100 |

- **Layout shift (CLS) is 0** on every page; **LCP** is 0.8 to 0.9 s on most pages (2.3 s on Experience).
- Mobile Performance moves a few points between runs. Single runs of `/resume/` (85) and `/about/` (90) came out low while the machine was busy; measured again three times each they scored 98 to 100 and 97 to 100. Use `LH_RUNS=3 npm run lighthouse` for steadier numbers.
- The Accessibility score of 100 and the axe tests (WCAG 2.2 A and AA, dark and light theme, 19 pages) agree. As explained above, that is a strong sign but not a certificate.

What was fixed because of these measurements: the home and Experience pages hid their top content until JavaScript had run (LCP 2.5 s), text jumped when the web font arrived (CLS 0.085 on Work), the About page used an invalid definition list, the Demo page skipped a heading level, and the language button's accessible name did not contain its visible text "ID".

## Browser tests (layout, accessibility, security)

The tests in `e2e/` use Playwright with the browser already installed on the machine (Edge on Windows, Chrome elsewhere; override with `PW_CHANNEL`). No browser download is needed.

```bash
npm run build
npm run test:e2e
```

| File | What it checks |
|---|---|
| `e2e/responsive.spec.ts` | At 360 and 390 px (touch emulation), every main page in English and Indonesian: nothing sticks out of the screen or is clipped, the Resume tabs stay inside their container, the menu opens, navigates and closes, header buttons are at least 40 px, the architecture diagram is a readable list. At 1280 px the diagram is a picture. |
| `e2e/quality.spec.ts` | **WCAG 2.2 AA with axe** on 19 pages in the dark and the light theme; the **Content Security Policy** blocks nothing the site needs; **structured data** is valid; icons, manifest and font preloads are served; the one-click resume buttons and the copy-email button work; the **print layout** hides navigation and shows every role |
| `e2e/share-cards.spec.ts` | Every page points at an existing 1200x630 PNG share image; the profile photo loads |

To look at a phone layout yourself: run `npm run dev -- --host` and open the printed network address on your phone (same Wi-Fi), or use the device toolbar in the browser's developer tools. CI runs all of these before it deploys.

## Share images (Open Graph)

`npm run build` also makes one 1200x630 PNG per page (30 files in `dist/og/`) and points each page's `og:image` and `twitter:image` at it, with `twitter:card` set to `summary_large_image`. This is the preview picture LinkedIn, WhatsApp, Slack and X show when a link is shared.

- **Home:** name, headline, positioning line, three labelled results and the profile photo. **Case studies:** the system title, its labelled results (Actual or Target) and its stack. **Other pages:** their title and description. English and Indonesian pages each get their own card.
- The text comes from the same content files as the site (`src/og.ts`), so cards cannot drift from it. The card layout is `scripts/og-cards-lib.mjs`; `scripts/og-images.mjs` renders it with the browser already installed (Edge on Windows, Chrome elsewhere; override with `PW_CHANNEL`), so `npm run build` needs one of them.
- The file name comes from the page address (`/work/x/` becomes `og/work-x.png`, `/id/` becomes `og/id.png`).
- Social networks cache previews. After a deploy, a link that was shared before keeps its old preview until the cache expires; LinkedIn's Post Inspector refreshes it.

## Profile photo

`public/profile.jpg` is shown in the home hero, on the About page and on the share cards. It is a 320x320 JPEG with all metadata removed. Tests fail if it is no longer square or small, or if it contains EXIF, GPS or XMP data (phone photos usually do), because it is published on a public site. To replace it, resize a square photo to about 320 px with a tool that drops metadata, save it as `public/profile.jpg`, and run `npm test`.

## Security: Content Security Policy

GitHub Pages cannot send HTTP headers, so the build puts a Content Security Policy in a `<meta>` tag at the top of every page (`scripts/csp-lib.mjs`, applied by `scripts/prerender.mjs`). It allows only the site's own files, the hash of its one inline script (the theme switch, computed at build time), inline styles, `data:` images and `data:` fonts, and forbids plugins (`object-src 'none'`). Anything else the browser is asked to load is blocked, which limits what an injected script could do. A test loads every page and fails on any blocked request. The policy is not applied in `npm run dev`.

## Structured data (JSON-LD)

Search engines read schema.org data from each page (`src/lib/jsonld.ts`): the home page describes the `WebSite` and the `Person` (name, job title, employer, school, profiles, skills), the About page the `Person`, and each case study a `BreadcrumbList`. The email address and the phone number are deliberately not included. A test checks this.

## Icons and the site mark

The mark is the initials written like a code tag, `<RH/>`, drawn from strokes (`scripts/brand-mark.mjs`) so it looks identical in the header, the favicon, the home-screen icons and the share cards. To switch to `<R/>`, change `MARK` in that file and run `npm run icons`; `docs/brand-preview.png` shows both at real sizes. A test fails if the favicon no longer matches the header mark.

### The icon system in the pages

All icons come from one place, `src/components/icons.tsx` (lucide, plus the GitHub and LinkedIn marks in `BrandIcons.tsx`), and follow a few rules so that the site looks like one piece:

- **One line weight** for every lucide icon (`svg.lucide { stroke-width: 1.75 }` in `globals.css`), instead of each icon's default.
- **Sizes:** 16 px inside text, buttons and badges (`AppIcon`); 14 px for dates, places and the "opens elsewhere" mark; and an **icon tile** (`IconTile`, a soft tinted square of 36 or 40 px) for cards that describe a thing: How I work, contact ways, the roles, features, quality goals, design topics and decisions of a personal project.
- **Badges carry an icon** (Actual, Target, Delivered, Contributed, Personal, Done, In progress); so do the scope and topic filters on Projects and the date and place lines on Experience.
- **Icons are decorations.** They are hidden from assistive technology (`aria-hidden`) and never carry meaning alone; the text beside them always says it. Diagrams are content, with a label of their own.
- Colour is the primary colour (tiles use a 10% tint with a thin ring), so a theme change recolours them all.

To give something an icon, add the lucide icon to the `icons` list under a short name, then refer to that name; for the personal project pages, icons are looked up by what they decorate (`personalIcons`), and `src/__tests__/icons.test.ts` fails when a feature, role, goal, topic, stack group or How I work item has none, or when an icon is not hidden from assistive technology.

## Resume buttons and copy email

The home page and the footer offer a one-click download of the recommended resume PDF (`primaryResumeKey` in `src/content/resume.ts`); the Contact page has a Copy email button that also announces the result to screen readers.

## Certifications and "Results at a glance"

**Order on the home page:** hero, then Certifications, then Results at a glance, then featured work, stack. Certifications come first on purpose: they are third-party proof a visitor can verify in one click, so they are seen without scrolling far.

**Certifications** are shown by `src/components/CertCard.tsx` on Home and About: Credly badge, level, issuer, date issued, valid until, a short summary and a "Verify on Credly" link. Where the data lives:

- Name and verify link: the Typst resume (`== Certifications` in `resume_us.typ`), the single source of truth.
- Everything else (issuer, level, dates, summary, badge file): `certMeta` in `src/content/profile.ts`, keyed by the exam code in the name (for example `CLF-C02`). The dates and issuer are copied from the Credly badge page; do not guess them.
- Badge image: `public/certs/`, downloaded from Credly (`https://images.credly.com/size/680x680/images/<image id>/image.png`, where the image id is in the badge page's `og:image`) and served from the site itself, because the Content Security Policy only allows images from the site.

To add or renew a certification: add the line to the Typst resume, add its entry to `certMeta`, put the badge PNG in `public/certs/`, then `npm run extract`, `npm test` (a test checks the badge is a PNG, the dates are in order, the link is a Credly badge URL, and that certifications appear before the results) and `npm run build`. The valid-until date is written by hand, so update it when a certification is renewed.

**Results at a glance** (`home.proof`) is the strip of four headline percentages (`proofSlugs` in `src/content/projects.ts`; the home share image uses the first three). It matters because a recruiter often scans for a few seconds, and measured results back up the claims in the hero. Keep it honest:

- Percentages only, never USD or absolute hours (see Content guardrails).
- Every card is labelled Actual (measured after go-live) or Target (from an approved proposal). Never present a target as an actual.
- Show only results that are confirmed. If a number is not confirmed yet, take it out instead of labelling it Actual.

## Animations

Tracked as GitHub issues #1 to #6 in the public repository. All of them are CSS or a few lines of JavaScript, with no animation library, and all of them respect `prefers-reduced-motion` (the visitor then sees the finished state at once).

| Animation | Where | How | Issue |
|---|---|---|---|
| Fade and rise on scroll | most sections | `.reveal`, scroll-driven CSS (`animation-timeline: view()`) | earlier work |
| Numbers count up | Results at a glance | `CountUp.tsx`: counts the first number once when it scrolls into view; the final text stays in the HTML and the figure keeps its width (`ch` units, tabular digits) | #1 done |
| Diagram drawn step by step | case-study architecture diagrams | boxes fade in, then each connection is drawn (`stroke-dashoffset`) while the figure scrolls from the bottom edge to the middle of the screen; arrow heads are plain triangles so they can follow their line | #2 done |
| Card lift and badge glint | project and certification cards | one shared `.lift` style (pointer devices only, also on keyboard focus); the glint is a gradient clipped to the badge shape with a mask | #3 done |
| Growing timeline | Experience | a primary-coloured line grows with scroll and each dot lights up as its role enters the screen | #4 done |
| Page transitions | every internal link | `TransitionLink.tsx` starts a View Transition (short cross-fade, header stays) when the browser supports it; modified clicks and unsupported browsers navigate as before; navigation scrolls to the top instantly | #5 done |
| Typing effect on the hero headline | Home | tried twice and removed (see below) | #6 not planned |
| Rotating role word under the headline | Home | `RotatingWord.tsx`: one short word (Tech Lead, System Analyst, Code Reviewer, Mentor; `alsoRoles` in `profile.ts`) is typed, held, erased and replaced. The first word is in the HTML, nothing moves for the first 2.5 s, the width and height are reserved, the animated part is hidden from screen readers (they get the full list as plain text), and nothing runs with reduced motion. LCP stays about 0.9 s | follow-up to #6 |

Rules for any new animation: respect reduced motion, animate only `transform` and `opacity` where possible, never cause layout shift (CLS stays 0), never hide content if the animation or JavaScript fails, add no animation library, leave print unaffected, and re-measure with `LH_RUNS=3 npm run lighthouse` (also `npm run test:e2e`) before merging.

**Why the typing effect was dropped:** the hero headline is a Largest Contentful Paint candidate. Hiding it for the effect, first with `clip-path` and then with a `transform` curtain, raised the mobile LCP of the home page from about 0.85 s to about 2.8 s (score 99-100 down to 90-96); with the effect disabled it returned to 0.8-0.9 s. A flourish is not worth a page that paints its largest element three times later. Lesson: anything that covers or delays the text of an above-the-fold element can move LCP, so measure the home page before shipping it. The accepted alternative is the rotating role word: it changes only the characters of one small element that is never the largest, and starts after the page has loaded; the home page measured the same as before (LCP 0.88 to 0.92 s, score 100).

**Largest Contentful Paint and the rotating word:** a text change counts as a new paint, so without a bigger element already registered as the LCP candidate, the first word change (about 4.5 s after load) became the LCP of a visitor who just waits (4.7 s instead of 0.8 s); Lighthouse showed it only in runs long enough to see it, usually the first, cold one. Elements that start at `opacity: 0` (the `rise` fade-in) are not counted as LCP candidates, so the hero heading deliberately has no fade-in: it is the large early candidate (about 0.7 to 0.8 s) that the word change cannot beat. An end-to-end test (`the largest contentful paint stays the hero heading…`) guards this. If you animate the hero heading again, run that test and check the first Lighthouse run, not only the median.

Measuring tip: scores move a few points between runs and a lot when the computer is busy (a busy machine once showed every page, including ones with no animation, dropping by 10 to 30 points). Use the median of 3 runs on a quiet machine, and compare against a control build before blaming a change.

## Visit statistics (optional, off by default)

The site can count page views and clicks on the resume and email buttons with [GoatCounter](https://www.goatcounter.com): free for personal sites, no cookies, no personal data, and it stays off for visitors whose browser sends Do Not Track. Nothing is loaded or sent unless you enable it:

1. Create a free account at goatcounter.com and pick a site code (for example `ridhwan`).
2. In the GitHub repository: Settings, Secrets and variables, Actions, Variables, add `GOATCOUNTER_CODE` with that code.
3. Push; the next build includes the script, widens the Content Security Policy for it, and shows a one-line privacy note in the footer.

To try it locally, build with `VITE_GOATCOUNTER_CODE=ridhwan npm run build`. Without the variable the build contains no third-party script at all. A test expects statistics to be on exactly when `VITE_GOATCOUNTER_CODE` is set, so it passes both in CI (variable set) and locally (not set).

Status: enabled for the live site with the site code `ridhwanhabib18` (dashboard: `https://ridhwanhabib18.goatcounter.com`). Changing the variable only takes effect after the next deploy (Actions, "Deploy to GitHub Pages", Run workflow).

### If the dashboard shows 0 visits

First, know what was verified: opening the live site in an automated browser loads `https://gc.zgo.at/count.js` (200) and sends `POST https://ridhwanhabib18.goatcounter.com/count?p=...`, which GoatCounter answers with 200. So the site side works. A zero on the dashboard is then almost always about the visitor's browser or network, not about the site. GoatCounter also discards hits from automated browsers (they send `b=153`), so test visits made by scripts never appear.

Likely causes, most common first:

1. **Ad or privacy blocker** (uBlock, AdGuard, Brave Shields and similar) blocks `gc.zgo.at`.
2. **Do Not Track is on.** The site deliberately loads nothing for those visitors.
3. **Company network or proxy** blocks the domain.
4. **GoatCounter's own ignore flag** is set in that browser (for example after using `#toggle-goatcounter` to skip your own visits).

How to check, about a minute:

1. Open the live site in a normal window, press F12, and choose the Network tab.
2. Reload and type `goatcounter` in the filter box.
3. You should see `count.js` and `count?p=...` with status 200. If they are red or "blocked", the cause is number 1 or 3.

The most reliable test: open the site on a phone using mobile data (not the company Wi-Fi) and look at the dashboard a few seconds later. If that visit shows up, everything works and only the first browser was blocking it. The dashboard's default period is the current week, so also check that the date range includes today.

## Printing

Printing a page (or saving it as PDF) hides the navigation, uses a white page with dark text, shows every role on the Experience page, and avoids breaking cards across pages (`@media print` in `src/styles/globals.css`).

## Translation review

The Indonesian text was written without a native reviewer. `npm run translations` writes `docs/translation-review.md`, a table of every English text next to its Indonesian translation (not committed), to hand to a native speaker. Changes go back into the source files; the table is only for reading.

## Reference API (ASP.NET Core)

`reference-api/` is a small real back end (the live demo that used to run in the browser was removed on 2026-11-06, so this is now where the full stack depth is shown): minimal APIs, a SignalR hub, an approval workflow, and 25 xUnit tests (unit and end-to-end with `WebApplicationFactory`). It is not deployed; see `reference-api/README.md`. CI runs `dotnet test` and the site is only deployed when it passes.

## Dependency and CI upkeep

`.github/dependabot.yml` opens weekly pull requests for npm packages and GitHub Actions; CI runs on each and you merge when it is green. The workflow uses the current action versions (Node 24 runtime). After merging a pull request on GitHub, run the sync in the private repository to bring the change into `Portfolio Web/site/`.

## Improvement roadmap (high, medium, low) and status

The list below came from a review of the site, ordered by impact on the goal (a recruiter contacts the owner) against effort. Status: **Done**, **Needs owner** (only the owner has the facts or permission) or **Not done**.

### High priority (big impact, small effort)

| Improvement | Why | Status |
|---|---|---|
| "Download resume (PDF)" in the hero and footer | The PDF was only on the Resume page, and recruiters look for it first. | Done |
| Lighthouse and axe audits | Performance and contrast had never been measured, although the target is Lighthouse 95+ and WCAG AA. axe now runs in the Playwright tests, so a violation fails CI. | Done (`npm run lighthouse`, `npm run test:e2e`) |
| `Person` structured data (JSON-LD) | Helps search engines recognise the owner, role, employer and profiles. | Done |
| Full icons and manifest | Only an SVG favicon existed; phones and tabs need `apple-touch-icon` and PNG sizes. | Done (site mark is `<RH/>`) |
| "Copy email" button | `mailto:` alone is awkward on a desktop without a mail client. | Done |

### Medium priority

| Improvement | Why | Status |
|---|---|---|
| Cookie-free analytics | Without it the PRD targets (resume downloads, contact clicks per 100 visits) cannot be measured. | Done, off by default (see Visit statistics) |
| Case-study polish: year, "what I would do differently", more key decisions | Only the owner knows the details; they are not invented here. | Needs owner |
| Indonesian translation review | The translations were drafted by the assistant and should be read by a native speaker, especially Experience and the case studies. | Needs owner (`docs/translation-review.md` is ready) |
| Print stylesheet | Experience and About can be printed or saved as PDF straight from the site. | Done |
| Recommendations or testimonials | Very convincing, but the person quoted must agree to publication. | Needs owner |
| CI upkeep | The old actions ran on Node 20, which is being retired; Dependabot keeps dependencies current. | Done |

### Low priority or planned

| Improvement | Why | Status |
|---|---|---|
| `reference-api/` (ASP.NET Core) | Shows real back-end skill (ASP.NET Core, SignalR, tests); the site itself is static. | Done (25 tests, not deployed) |
| Custom domain | Already planned. | Needs owner (see below) |
| Content Security Policy via `<meta>` | Needs care because of the inline theme script in `index.html`. | Done (script is allowed by hash) |
| Visual regression tests (screenshots compared automatically) | Catches unintended layout changes. | Not done |
| Email address in the HTML can be harvested by spam bots | It is already public on the resume and LinkedIn, so the risk is small. | Not done, accepted |

Recommended order was: measure first (Lighthouse and axe on every page, mobile and desktop), then fix what the numbers show together with the hero resume button, so the rest is decided from data and not guesses.

## Still needs input from the owner

- **Case studies:** add a year (`year` in `src/content/projects.ts`) and the "what I would do differently" section (`lookback`) where you have something to say, and more key decisions. Only you know the details; they are not invented here.
- **Testimonials or recommendations:** a short quote from a manager or colleague works well, but needs their permission to be published.
- **Indonesian review:** hand `docs/translation-review.md` to a native speaker.
- **Custom domain:** buy it, add the DNS records GitHub Pages asks for, and add a `public/CNAME` file containing the domain.

## UI

Tailwind CSS v4 with shadcn/ui-style components (Radix primitives, `class-variance-authority`, `tailwind-merge`) in `src/components/ui/`. **Dark is the default**; only an explicit light choice (saved in `localStorage`) removes the `dark` class, and this happens before first paint. Theme tokens (oklch, zinc base with a blue primary) live in `src/styles/globals.css`. Fonts are Inter (UI) and JetBrains Mono (tags and code), self-hosted.

The components were written by hand. To add more from the shadcn registry, run `npx shadcn@latest add <component>`; `components.json` is already configured.

## Pre-rendering

`npm run build` renders every route in both languages (30 pages) to static HTML, so each page answers HTTP 200, carries its own `<title>`, description, canonical URL, `hreflang` and Open Graph tags, and shows content before JavaScript loads. The browser then hydrates the page.

- `src/entry-server.tsx` renders one route; `scripts/prerender.mjs` writes `dist/<route>/index.html`, `404.html` (an empty shell that the client router fills), `sitemap.xml` and `robots.txt`.
- `src/components/Seo.tsx` collects head data during the server render and keeps it in sync on client navigation.
- Scroll-reveal content stays visible in the HTML and without JavaScript; it is only hidden after the head script adds the `js` class to `<html>`.
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
| Professional case studies, metrics, diagrams | `src/content/projects.ts` |
| Personal projects (shown on the Projects page) | `src/content/personal-projects.ts` |
| Experience timeline | `src/content/experience.ts` |
| Resume text (summaries, experience bullets, skills, education, certifications, contact links) | `resume/resume_us.typ`, then run `npm run extract` |
| Indonesian translation of that text | `src/content/resume.id.ts` (keyed by the exact English source string) |
| Resume variant labels on the site and PDF links | `src/content/resume.ts` |
| Availability badge | `available` in `src/content/profile.ts` |

## The Projects page: professional work and personal projects

`/work` is one page called **Projects** (the address is kept so shared links still work). It has two groups, with buttons to show all, only the professional work, or only the personal projects, and a topic filter that applies to both:

- **Professional** (`src/content/projects.ts`): the case studies from the resume. They keep every guardrail: percentages only, Actual or Target labels, and tests that tie each one to its resume bullet.
- **Personal projects** (`src/content/personal-projects.ts`): projects built outside an employer, with public code. They are not resume case studies, so the resume tests do not apply, but they have their own tests (`personal-projects.test.ts`): everything in English and Indonesian, one entry per technology, links only to public GitHub pages of the owner, and no employer, currency or phone-like text. Say only what the project's own README and documentation say. The role of SchoMans is worded as "System Architect, System Design and Author, assisted by Claude" (the owner's choice), here and in the resumes. The first one is SchoMans, with its whole documented stack by layer.

Each personal project has a **state** (`done` when every planned phase is built and tested, or `in-progress`), shown as a badge on its card and its page, and its **own page** at `/work/<slug>` (pre-rendered in both languages, with its own share image), in the style of the README of its repository but fuller: overview and highlights, who uses it, features, system architecture (two diagrams drawn from data), system design (quality goals, security, real-time and jobs, file storage), key decisions (ADRs), the whole tech stack by layer, build phases, documentation links, how to start, and a gallery of flows and screens.

To add a personal project: add an entry to `personalProjects` in `src/content/personal-projects.ts` (every field, each text in both languages; the fields are described in the interface at the top of that file), copy the pictures you want into `public/projects/<slug>/` (the tests check that each exists and has the width and height written in the data), and run `npm test` and `npm run build`. The card, the page, the filters, the sitemap, the Indonesian page and the share image need no other change. Keep to what the project's README and documentation say, link only to its public pages, and never put sign-in details (even for local demo accounts) on the page; a test fails on passwords and API keys. When a project's state changes (for example it is deployed), update `state`, `status` and `phases`.

**Skills instead of a separate page:** the grouped skills are a section ("Skills") on About, with the first items of each group on Home, both read from the resume source (`## Skills` in `resume_us.typ`). The whole SchoMans stack from its PRD was added there and to all three resumes (US, AU, CA), which also have a Personal Projects section. Check the page count with Typst after adding to them (all three are 2 pages for every role); Typst is installed under the winget packages folder but not on the PATH.

## Not done yet

- A custom domain (buy it, then see the steps under *Still needs input from the owner*).
