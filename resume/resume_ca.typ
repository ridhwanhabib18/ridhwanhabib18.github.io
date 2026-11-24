#import "@preview/basic-resume:0.2.9": *

// ---------- Personal details ----------
// Canada: city and country is enough, no full address, no photo, no date of birth
#let name = "Muhammad Ridhwan Habib Abdillah"
#let location = "Bekasi Regency, West Java, Indonesia"
// Shorter place name for the header only, so the contact line fits on one line (an applicant tracking system can then read the LinkedIn address whole).
#let header-location = "Bekasi, Indonesia"
#let email = "eng.ridhwan18@gmail.com"
// TODO: replace with a dedicated job-search number (international format, WhatsApp enabled)
#let phone = "" // The real number lives only in the private repository and is never published.
#let linkedin = "linkedin.com/in/mridhwanhabib"
#let github = "github.com/ridhwanhabib18"
#let website = "ridhwanhabib18.github.io"

// Build inputs (used by the website build): --input role=<senior|lead|analyst> --input public=true
// public=true leaves out the phone number and the work-authorization line, for a PDF published on the web.
#let public = sys.inputs.at("public", default: "false") == "true"

#show: resume.with(
  author: name,
  location: header-location,
  email: email,
  phone: if public { "" } else { phone },
  linkedin: linkedin,
  github: github,
  personal-site: website,
  accent-color: "#26428b",
  paper: "us-letter",
)

// No hyphenation: a word split at a line end can reach an applicant tracking system as two fragments.
#set text(hyphenate: false)

// ---------- Per-application settings ----------
// Pick one per application: "senior" (recommended), "lead" or "analyst"
#let role = sys.inputs.at("role", default: "senior")

// One short line for applicants abroad. Edit to match your real situation,
// or set show-work-auth to false and answer it in the application form instead.
#let show-work-auth = not public
#let work-auth = "Open to relocation to Canada and to remote roles; will require work authorization or employer sponsorship."

#let summaries = (
  senior: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry, a global manufacturer. Delivered 5 production systems end to end with ASP.NET Core, React/TypeScript and SQL Server, backed by CI/CD, integration tests and clear system design. One system cut part review preparation by about 86% and eliminated paper and ink.",
  lead: "Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. Over 4+ years, delivered 5 manufacturing systems end to end, from business case and stage-gate design reviews to architecture, ASP.NET Core and React code, SQL Server, CI/CD and production support. Set coding standards, run code reviews and mentor a junior developer.",
  analyst: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 manufacturing systems; one cut part review preparation by about 86%.",
)

== Professional Summary
#summaries.at(role)
#if show-work-auth [
#work-auth
]

== Impact Highlights
- *About 86% faster* part review preparation and fully paperless part review in the Parts Engineering system (actual)
- *About 90% faster* production-line program update (hours to minutes), with no flash-disk distribution and no wrong-version installs, in the Production File Distribution system (actual)
- *Targets:* about 48% less planner workload (Production Planning) and a large reduction in manual invoice handling effort (Paperless Invoice), per approved proposals

== Work Experience
#work(
  title: "Full Stack .NET Developer (System Development Staff)",
  company: "PT Indonesia Epson Industry",
  location: "Bekasi, Indonesia",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Present"),
)
#if role == "lead" [
- *Leadership and stakeholders:* turn requirements from production, engineering, purchasing and management into proposals and present them at stage-gate design reviews; lead code reviews, mentor a junior developer and set coding standards for a 2-person team
]

- *Parts Engineering Management System:* replaced the paper part review inspection sheet with an online approval workflow, inspection platform integration, Hangfire jobs and Telerik reports on ASP.NET MVC 5 and Dapper (200+ SQL Server stored procedures). *Result: part review preparation about 86% faster, manual part master and index creation removed, paper and ink eliminated, measured annual cost savings*
- *Production File Distribution & Monitoring System (v1, then v2 upgrade):* replaced manual flash-disk distribution of production program files with central management, automatic install, real-time file-match monitoring, remote update and a change audit trail; v2 added background download and scheduled version changes, after line trials and rollout to multiple factories (ASP.NET Core, React, SignalR, Hangfire, WinForms client). *Result: line recovery after a program change about 90% faster (hours to minutes), manual installation by 2 people removed, flash-disk virus risk and wrong-version installs eliminated*
- *Process Inspection Data System:* automatic collection of inspection data from line PCs (WinForms/ClickOnce agent) with live production progress and adjustment-rate dashboards (SignalR, Quartz.NET). Cut engineering time on manual inspection data handling by about 86%
- *Production Planning & Scheduling System:* replaced manual Excel planning with an automated hourly planning cycle, capacity control, simulation and approval workflow. Architected on .NET 10 (minimal API, EF Core, 45+ migrations), a React SPA and a clustered Quartz.NET Windows Service, with WIP stock system integration. *Target: about 48% less planner workload, payback within the first year*
- *Paperless Invoice Approval System:* digitized supplier invoice and DN/CN handling with AWS S3 and Textract OCR, vendor-specific extraction rules and Keycloak SSO (ASP.NET Core 8, React/TypeScript). *Target: large reduction in manual invoice handling effort*
- *Supporting contributions (3 further projects):* developed SQL Server stored procedures for the part approval certification workflow (certification preparation about 96% faster); implemented real-time WebSocket communication with SignalR for operator work-cycle time monitoring; and reviewed code for a printer function-test data summary system on the production line
- *Engineering practice:* built GitHub Actions CI/CD (tests on every pull request, GitVersion, IIS deploy with backup and EF migration), API and database integration tests, and reverse-engineered PRDs, system designs, ERDs and ADRs for existing systems to cut knowledge risk

#if role != "lead" [
- *Leadership and stakeholders:* turn requirements from production, engineering, purchasing and management into proposals and present them at stage-gate design reviews; lead code reviews, mentor a junior developer and set coding standards for a 2-person team
]

#work(
  title: "Embedded Systems Engineer Intern",
  company: "PT Xirka Silicon Technology",
  location: "Bandung, Indonesia",
  dates: dates-helper(start-date: "Jan 2021", end-date: "Feb 2021"),
)
- Implemented and tested RS-232 and RS-485 communication modules on embedded boards (Arduino, C, C++)

#work(
  title: "Robotics Engineer",
  company: "Gadjah Mada Robotics Team (GMRT)",
  location: "Yogyakarta, Indonesia",
  dates: dates-helper(start-date: "Oct 2019", end-date: "Feb 2022"),
)
- Robot electronics and PCB design, C++ firmware (STM32, PID), OpenCV and ROS; competed twice in the KRI robot contest

== Personal Projects

- *SchoMans, School Management System (2026):* architect and author (assisted by Claude) of a 6-role school platform: real-time QR attendance (SignalR), grading, admissions, approvals, PDF report cards and AI features with human review (.NET 10, SQL Server, Keycloak, React 19); end-to-end tests; demo at #link("https://ridhwanhabib18.github.io/work/schomans/")[ridhwanhabib18.github.io/work/schomans]
- *Coffee Roasto, Coffee Roaster Monitoring and Control (2026):* author of the Windows app and Arduino firmware of my thesis system, rewritten on .NET 10: automatic coffee roasting with a PID controller that follows an Excel profile (WPF, Arduino); 32 unit tests; demo at #link("https://ridhwanhabib18.github.io/work/coffee-roasto/")[ridhwanhabib18.github.io/work/coffee-roasto]
- *LineWise, Operations and Quality Management (2026):* architect and author (assisted by Claude) of a 7-role plant platform (Angular, .NET 10, PostgreSQL); demo at #link("https://ridhwanhabib18.github.io/work/linewise/")[ridhwanhabib18.github.io/work/linewise]

== Education

#edu(
  institution: "Universitas Gadjah Mada",
  location: "Yogyakarta, Indonesia",
  dates: dates-helper(start-date: "Aug 2018", end-date: "Oct 2022"),
  degree: "Bachelor of Engineering (S.T.) in Electrical Engineering"
)
- GPA: 3.47 / 4.00
- Undergraduate Thesis: *Temperature Regulation System for Robusta Coffee Roaster using PID Control with Motorized Ball Valve*, built with a .NET desktop app

== Technical Skills

- *Programming Languages & Backend:* C\#, Python, ASP.NET Core (MVC, Web API, Minimal API), ASP.NET MVC 5, .NET Framework, .NET 10, Entity Framework Core, Dapper, T-SQL, SQL Server, PostgreSQL, Npgsql, FluentValidation, OpenAPI, QuestPDF, ClosedXML, PdfPig, Serilog, Seq
- *Frontend Development:* React, Angular, Angular Material, RxJS, TypeScript, JavaScript, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, shadcn/ui, Recharts, react-i18next, oidc-client-ts, Axios, orval, Razor, HTML, CSS, Bootstrap, jQuery, AJAX
- *Cloud Platforms & Integration:* AWS (S3, EC2, RDS, ECS, Lambda, Bedrock, Textract), Keycloak (OIDC/JWT, PKCE), MinIO, SeaweedFS, Cloudflare R2, SignalR, Quartz.NET, Hangfire, Claude API, Ollama
- *Software Architecture & Delivery:* System design, N-layered Architecture, Clean Architecture, Vertical Slice Architecture, REST APIs, SDLC, Agile, Waterfall, Requirements Gathering, Business Case and ROI, PRDs, ADRs, UAT
- *DevOps & Quality Assurance:* Git, GitHub Actions (CI/CD), GitVersion, IIS, Docker, Docker Compose, Caddy, Linux, xUnit, Testcontainers, Vitest, Playwright, integration testing, code review
- *Desktop Applications & Reporting:* WinForms, ClickOnce, WPF (MVVM, WPF-UI, CommunityToolkit.Mvvm), ScottPlot, ExcelDataReader, Telerik Reporting, SQL Server Reporting Services, Robotic Process Automation (RPA)
- *Additional Skills:* Vue.js, PHP, Laravel, Arduino, C/C++, embedded firmware, PID control, PCB design, STM32, OpenCV, ROS, serial communication (USB, RS-232, RS-485), MAX6675

== Certifications

- *AWS Certified Cloud Practitioner (CLF-C02)*, Amazon Web Services, #link("https://www.credly.com/badges/bc1ed2db-21b9-462e-b08a-b3e727911062")[verify]
- *AWS Certified AI Practitioner (AIF-C01)*, Amazon Web Services, #link("https://www.credly.com/badges/995a969c-1ada-49e5-84de-53b483dca02f")[verify]

== Languages

// TODO: add French or German here only if you can state a level honestly
- English (professional working proficiency), Indonesian (native)

// Note: no Referees section on purpose. In Canada, keep a separate references sheet and send it only when asked.
