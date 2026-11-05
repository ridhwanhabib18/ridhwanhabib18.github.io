#import "@preview/basic-resume:0.2.9": *

#let name = "Muhammad Ridhwan Habib Abdillah"
#let location = "Bekasi Regency, West Java, Indonesia"
#let email = "eng.ridhwan18@gmail.com"
#let linkedin = "linkedin.com/in/mridhwanhabib"
#let github = "github.com/ridhwanhabib18"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  linkedin: linkedin,
  github: github,
  accent-color: "#26428b",
  paper: "us-letter",
)

// Pick one per application: "lead", "senior" or "analyst".
// The site build compiles all three with: typst compile --input role=<role> main.typ
#let role = sys.inputs.at("role", default: "lead")

#let summaries = (
  lead: "Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. Over 4+ years, delivered 5 manufacturing systems end to end, from business case and design reviews to architecture, ASP.NET Core and React code, SQL Server, CI/CD and production support. Set coding standards, run code reviews and mentor a junior developer. Seeking a Tech Lead role.",
  senior: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry, delivering 5 manufacturing systems end to end with ASP.NET Core, React/TypeScript and SQL Server, backed by CI/CD, integration tests and clear system design. One system cut part review preparation by about 86%. Seeking a Senior Software Engineer role.",
  analyst: "Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 manufacturing systems, one of which cut part review preparation by about 86%. Seeking a System Analyst role.",
)

== Professional Summary
#summaries.at(role)

== Impact Highlights
- *About 86% faster* part review preparation and fully paperless part review in the Parts Engineering system, and *about 96% faster* part approval certification preparation in the certification workflow I supported (actual)
- *About 90% faster* production-line program update (hours to minutes), with no flash-disk distribution and no wrong-version installs, in the Production File Distribution system (actual)
- *Targets:* about 48% less planner workload (Production Planning) and a large reduction in manual invoice handling effort (Paperless Invoice), per approved proposals

== Work Experience
#work(
  title: "Full Stack .NET Developer (System Development Staff)",
  company: "PT Indonesia Epson Industry",
  location: "Bekasi Regency, Indonesia",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Present"),
)
#if role == "lead" [
- *Leadership and stakeholders:* turn requirements from production, engineering, purchasing and management into proposals and present them at stage-gate design reviews; lead code reviews, mentor a junior developer and set coding standards for a 2-person team
]

- *Parts Engineering Management System:* replaced the paper part review inspection sheet with an online approval workflow, inspection platform integration, Hangfire jobs and Telerik reports on ASP.NET MVC 5 and Dapper (200+ SQL Server stored procedures). *Result: part review preparation about 86% faster, manual part master and index creation removed, paper and ink eliminated, measured annual cost savings*
- *Production Planning & Scheduling System:* replaced manual Excel planning with an automated hourly planning cycle, capacity control, simulation and approval workflow. Architected on .NET 10 (minimal API, EF Core, 45+ migrations), a React SPA and a clustered Quartz.NET Windows Service, with WIP stock system integration. *Target: about 48% less planner workload, payback within the first year*
- *Paperless Invoice Approval System:* digitizes supplier invoice and DN/CN handling with AWS S3 and Textract OCR, vendor-specific extraction rules and Keycloak SSO (ASP.NET Core 8, React/TypeScript). *Target: large reduction in manual invoice handling effort*
- *Production File Distribution & Monitoring System (v1, then v2 upgrade):* replaced manual flash-disk distribution of production program files with central management, automatic install, real-time file-match monitoring, remote update, change audit trail, and (v2) background download, scheduled version changes and column filtering, after line trials and rollout to multiple factories (ASP.NET Core, React, SignalR, Hangfire, WinForms client). *Result: line recovery after a program change about 90% faster (hours to minutes), removed the need for 2 people to install manually, flash-disk virus risk and wrong-version installs removed*
- *Process Inspection Data System:* automatic collection of inspection data from line PCs (WinForms/ClickOnce agent) with live production progress and adjustment-rate dashboards (SignalR, Quartz.NET)
- *Supporting contributions (3 further projects):* developed SQL Server stored procedures for the part approval certification workflow (certification preparation about 96% faster); implemented real-time WebSocket communication with SignalR for operator work-cycle time monitoring; and reviewed code for a printer function-test data summary system on the production line
- *Engineering practice:* built GitHub Actions CI/CD (tests on every pull request, GitVersion, IIS deploy with backup and EF migration), API and database integration tests, and reverse-engineered PRDs, system designs, ERDs and ADRs for existing systems to cut knowledge risk

#if role != "lead" [
- *Leadership and stakeholders:* turn requirements from production, engineering, purchasing and management into proposals and present them at stage-gate design reviews; lead code reviews, mentor a junior developer and set coding standards for a 2-person team
]


#work(
  title: "Embedded System Engineer Intern",
  company: "PT Xirka Silicon Technology",
  location: "Bandung, Indonesia",
  dates: dates-helper(start-date: "Jan 2020", end-date: "Feb 2020"),
)
- Implemented and tested RS-232 and RS-485 communication modules on embedded development boards
- Developed embedded programs using Arduino, C, and C++
- Assisted in hardware–software integration and system validation

== Education

#edu(
  institution: "Universitas Gadjah Mada",
  location: "Special Region of Yogyakarta, Indonesia",
  dates: dates-helper(start-date: "Aug 2018", end-date: "Oct 2022"),
  degree: "Bachelor of Engineering (S.T.) in Electrical Engineering"
)
- GPA: 3.47 / 4.00
- Undergraduate Thesis: *Temperature Regulation System for Robusta Coffee Roaster using PID Control with Motorized Ball Valve* built with .Net Desktop App

== Technical Skills

- *Core:* C\#, ASP.NET Core (MVC, Minimal API, Web API), .NET Framework, Entity Framework Core, Dapper, SignalR, T-SQL, Microsoft SQL Server
- *Front End:* React, TypeScript, Vite, MUI, KendoReact, Razor, jQuery; also Angular, Vue.js, Node.js, Laravel
- *Architecture & Integration:* system design, layered architecture, REST APIs, Keycloak (OpenID Connect, JWT), AWS (S3, Textract, Cognito), MinIO, Elsa Workflows, Quartz.NET, Hangfire
- *DevOps & Quality:* Git, GitHub Actions, GitVersion, Azure DevOps, IIS, Docker, Linux, WebApplicationFactory and LocalDB tests, code review
- *Desktop & Reporting:* WinForms, ClickOnce, Telerik Reporting, EPPlus; MySQL, Python, PHP
- *Analysis & Management:* SDLC, requirements gathering, business case and ROI, PRD, ADR, UAT, Microsoft Power Platform


== Certifications

- *AWS Certified Cloud Practitioner (CLF-C02)* — Amazon Web Services (AWS) \
  [Verify Credential](https://www.credly.com/badges/bc1ed2db-21b9-462e-b08a-b3e727911062)

- *AWS Certified AI Practitioner (AIF-C01)* — Amazon Web Services (AWS) \
  [Verify Credential](https://www.credly.com/badges/995a969c-1ada-49e5-84de-53b483dca02f)
