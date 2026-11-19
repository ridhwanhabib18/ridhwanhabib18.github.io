#import "@preview/basic-resume:0.2.9": *

// ---------- Personal details ----------
#let name = "Muhammad Ridhwan Habib Abdillah"
#let location = "Bekasi Regency, West Java, Indonesia"
#let email = "eng.ridhwan18@gmail.com"
// TODO: replace with a dedicated job-search number (international format, WhatsApp enabled)
#let phone = "" // The real number lives only in the private repository and is never published.
#let linkedin = "linkedin.com/in/mridhwanhabib"
#let github = "github.com/ridhwanhabib18"
#let website = "ridhwanhabib18.github.io"

// Build inputs (used by the website build): --input role=<senior|lead|analyst> --input public=true
// public=true leaves out the phone number and the work-rights line, for a PDF published on the web.
#let public = sys.inputs.at("public", default: "false") == "true"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  phone: if public { "" } else { phone },
  linkedin: linkedin,
  github: github,
  personal-site: website,
  accent-color: "#26428b",
  paper: "a4",
)

// ---------- Per-application settings ----------
// Pick one per application: "senior" (recommended for Australia), "lead" or "analyst"
#let role = sys.inputs.at("role", default: "senior")

// Edit to match your real situation before sending. Do not claim rights you do not hold.
#let work-rights = "Based in Indonesia. Open to relocation to Australia (employer sponsorship required) and to remote roles with AEST overlap."

// Set to false to hide the Referees section (e.g. for non-Australian applications)
#let show-referees = false

#let summaries = (
  senior: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry, a global manufacturer. Delivered 5 production systems end to end with ASP.NET Core, React/TypeScript and SQL Server, backed by CI/CD, integration tests and clear system design. One system cut part review preparation by about 86% and eliminated paper and ink. Seeking a Senior Software Engineer role.",
  lead: "Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. Over 4+ years, delivered 5 manufacturing systems end to end, from business case and stage-gate design reviews to architecture, ASP.NET Core and React code, SQL Server, CI/CD and production support. Set coding standards, run code reviews and mentor a junior developer. Seeking a Tech Lead role.",
  analyst: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 manufacturing systems; one cut part review preparation by about 86%. Seeking a System Analyst role.",
)

== Professional Summary
#summaries.at(role)

#if not public [
*Work rights:* #work-rights
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
- *Paperless Invoice Approval System:* digitised supplier invoice and DN/CN handling with AWS S3 and Textract OCR, vendor-specific extraction rules and Keycloak SSO (ASP.NET Core 8, React/TypeScript). *Target: large reduction in manual invoice handling effort*
- *Supporting contributions (3 further projects):* developed SQL Server stored procedures for the part approval certification workflow (certification preparation about 96% faster); implemented real-time WebSocket communication with SignalR for operator work-cycle time monitoring; and reviewed code for a printer function-test data summary system on the production line
- *Engineering practice:* built GitHub Actions CI/CD (tests on every pull request, GitVersion, IIS deploy with backup and EF migration), API and database integration tests, and reverse-engineered PRDs, system designs, ERDs and ADRs for existing systems to cut knowledge risk

#if role != "lead" [
- *Leadership and stakeholders:* turn requirements from production, engineering, purchasing and management into proposals and present them at stage-gate design reviews; lead code reviews, mentor a junior developer and set coding standards for a 2-person team
]

#work(
  title: "Embedded System Engineer Intern",
  company: "PT Xirka Silicon Technology",
  location: "Bandung, Indonesia",
  dates: dates-helper(start-date: "Jan 2021", end-date: "Feb 2021"),
)
- Implemented and tested RS-232 and RS-485 communication modules on embedded development boards
- Developed embedded programs using Arduino, C and C++
- Assisted in hardware–software integration and system validation

== Personal Projects

- *SchoMans, School Management System (2026):* system architect, system designer and author (assisted by Claude) of an end-to-end school platform for 6 roles: real-time QR attendance (SignalR), grading, assignments, admissions, announcements, approval workflows, PDF report cards and AI features with human review (.NET 10, Clean Architecture, SQL Server, Keycloak, Hangfire, React 19, TypeScript). Unit, integration and Playwright end-to-end tests for each phase; demo at #link("https://ridhwanhabib18.github.io/work/schomans/")[ridhwanhabib18.github.io/work/schomans]
- *Coffee Roasto, Coffee Roaster Monitoring and Control (2026):* author of the Windows app and Arduino firmware of my undergraduate thesis system, rewritten on .NET 10: monitors a drum coffee roaster and roasts automatically with a PID controller that follows an Excel reference profile (WPF, MVVM, ScottPlot, Arduino C++). 32 unit tests plus a firmware simulation whose 12 scenarios match traces of the original firmware; demo and documentation at #link("https://ridhwanhabib18.github.io/work/coffee-roasto/")[ridhwanhabib18.github.io/work/coffee-roasto]
- *LineWise, Manufacturing Operations and Quality Management System (2026):* architect and author (assisted by Claude) of a 7-role plant quality platform with two-step approvals, KPI dashboards and an audit trail (Angular, .NET 10, PostgreSQL, Keycloak); demo at #link("https://ridhwanhabib18.github.io/work/linewise/")[ridhwanhabib18.github.io/work/linewise]

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
- *Web Development:* React, Angular, Angular Material, RxJS, TypeScript, JavaScript, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, shadcn/ui, Recharts, react-i18next, oidc-client-ts, Axios, orval, Razor, HTML, CSS, Bootstrap, jQuery, AJAX
- *Cloud & Integration:* AWS (S3, EC2, RDS, ECS, Lambda, Bedrock, Textract), Keycloak (OIDC/JWT, PKCE), MinIO, SeaweedFS, Cloudflare R2, SignalR, Quartz.NET, Hangfire, Claude API, Ollama
- *Architecture & Delivery:* System design, N-layered Architecture, Clean Architecture, Vertical Slice Architecture, REST APIs, SDLC, Agile, Waterfall, Requirements Gathering, Business Case and ROI, PRDs, ADRs, UAT
- *DevOps & Testing:* Git, GitHub Actions (CI/CD), GitVersion, IIS, Docker, Docker Compose, Caddy, Linux, xUnit, Testcontainers, Vitest, Playwright, integration testing, code review
- *Desktop & Reporting:* WinForms, ClickOnce, WPF (MVVM, WPF-UI, CommunityToolkit.Mvvm), ScottPlot, ExcelDataReader, Telerik Reporting, SQL Server Reporting Services, Robotic Process Automation (RPA)
- *Additional Technical Skills:* Vue.js, PHP, Laravel, Arduino, C/C++, embedded firmware, PID control, serial communication (USB, RS-232, RS-485), MAX6675

== Certifications

- *AWS Certified Cloud Practitioner (CLF-C02)*, Amazon Web Services \
  #link("https://www.credly.com/badges/bc1ed2db-21b9-462e-b08a-b3e727911062")[Verify credential]

- *AWS Certified AI Practitioner (AIF-C01)*, Amazon Web Services \
  #link("https://www.credly.com/badges/995a969c-1ada-49e5-84de-53b483dca02f")[Verify credential]

== Languages

// TODO: add German here if you want to list it (level was not visible on your LinkedIn page)
- Indonesian (native), English (professional working proficiency)

#if show-referees [
== Referees

// TODO: replace with 2 real people who agreed to be contacted. Remove this section if you cannot.
- *Full Name*, Job Title, PT Indonesia Epson Industry (direct manager) \
  +62 XXX XXXX XXXX | name\@example.com
- *Full Name*, Job Title, Company (senior colleague or stakeholder) \
  +62 XXX XXXX XXXX | name\@example.com
] 
#if show-referees != true [
== Referees
Available on request.
]