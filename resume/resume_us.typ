#import "@preview/basic-resume:0.2.9": *

// ---------- Personal details ----------
#let name = "Muhammad Ridhwan Habib Abdillah"
#let location = "Bekasi Regency, West Java, Indonesia"
#let email = "eng.ridhwan18@gmail.com"
// TODO: replace with a dedicated job-search number (international format, WhatsApp enabled)
#let phone = "" // The real number lives only in the private repository and is never published.
#let linkedin = "linkedin.com/in/mridhwanhabib"
#let github = "github.com/ridhwanhabib18"

// Build inputs (used by the website build): --input role=<senior|lead|analyst> --input public=true
// public=true leaves out the phone number and the work-authorization line, for a PDF published on the web.
#let public = sys.inputs.at("public", default: "false") == "true"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  phone: if public { "" } else { phone },
  linkedin: linkedin,
  github: github,
  accent-color: "#26428b",
  paper: "us-letter",
)

// ---------- Per-application settings ----------
// Pick one per application: "senior" (recommended), "lead" or "analyst"
#let role = sys.inputs.at("role", default: "senior")

// Optional one-line note on location and work authorization.
// Edit to match your real situation, or set show-work-auth to false and answer it in the application form instead.
#let show-work-auth = not public
#let work-auth = "Based in Indonesia. Open to relocation and remote work; will require visa sponsorship."

#let summaries = (
  senior: "Full Stack .NET Engineer with 4+ years at a global manufacturer, building internal systems with ASP.NET Core, React/TypeScript and SQL Server. Delivered 5 production systems end to end. Cut part review preparation by about 86% and production-line recovery time after program changes by about 90%. Strong in CI/CD, integration testing and system design.",
  lead: "Full Stack .NET Engineer and technical lead of a 2-person team at a global manufacturer. Delivered 5 production systems end to end with ASP.NET Core, React/TypeScript and SQL Server. Set coding standards, run code reviews and mentor a junior developer. Cut part review preparation by about 86% and line recovery time by about 90%.",
  analyst: "Full Stack .NET Engineer with 4+ years at a global manufacturer who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 production systems end to end. Cut part review preparation by about 86%.",
)

== Summary
#summaries.at(role)
#if show-work-auth [
#work-auth
]

== Experience
#work(
  title: "Full Stack .NET Developer (System Development Staff)",
  company: "PT Indonesia Epson Industry",
  location: "Bekasi, Indonesia",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Present"),
)
#if role == "lead" [
- *Leadership:* lead code reviews, mentor a junior developer and set coding standards for a 2-person team; present proposals to production, engineering, purchasing and management at stage-gate design reviews
]

- *Parts Engineering Management System:* replaced the paper part review inspection sheet with an online approval workflow (ASP.NET MVC 5, Dapper, 200+ SQL Server stored procedures, Hangfire, Telerik). Cut part review preparation by about 86%, removed manual part master and index creation, eliminated paper and ink, and delivered measured annual cost savings
- *Production File Distribution & Monitoring System:* replaced flash-disk distribution of line program files with central management, automatic install and real-time file-match monitoring (ASP.NET Core, React, SignalR, WinForms client), rolled out to multiple factories. Cut line recovery after a program change by about 90% (hours to minutes) and removed manual installs by 2 people
- *Process Inspection Data System:* automated inspection data collection from line PCs (WinForms/ClickOnce) with live production progress dashboards (SignalR, Quartz.NET). Cut engineering time on manual inspection data handling by about 86%
- *Production Planning & Scheduling System:* replaced manual Excel planning with automated hourly planning, simulation and approval workflow on .NET 10, EF Core, React and a clustered Quartz.NET service. Target: about 48% less planner workload
- *Paperless Invoice Approval System:* digitized supplier invoice handling with AWS S3 and Textract OCR and Keycloak SSO (ASP.NET Core 8, React/TypeScript). Target: large reduction in manual invoice handling effort
- *Supporting contributions (3 further projects):* developed SQL Server stored procedures for the part approval certification workflow (certification preparation about 96% faster); implemented real-time WebSocket communication with SignalR for operator work-cycle time monitoring; and reviewed code for a printer function-test data summary system on the production line
- *Engineering practice:* built GitHub Actions CI/CD (PR tests, GitVersion, IIS deploy with backup and EF migration), API and database integration tests, and reverse-engineered PRDs, ERDs and ADRs for existing systems

#if role != "lead" [
- *Leadership:* lead code reviews, mentor a junior developer and set coding standards for a 2-person team; present proposals to production, engineering, purchasing and management at stage-gate design reviews
]

// TODO: delete this block if the page overflows
#work(
  title: "Embedded Systems Engineer Intern",
  company: "PT Xirka Silicon Technology",
  location: "Bandung, Indonesia",
  dates: dates-helper(start-date: "Jan 2021", end-date: "Feb 2021"),
)
- Implemented and tested RS-232 and RS-485 communication modules on embedded boards using Arduino, C and C++

== Education

#edu(
  institution: "Universitas Gadjah Mada",
  location: "Yogyakarta, Indonesia",
  dates: dates-helper(start-date: "Aug 2018", end-date: "Oct 2022"),
  degree: "Bachelor of Engineering in Electrical Engineering, GPA 3.47 / 4.00"
)

== Skills

- *Programming & Backend:* C\#, Python, ASP.NET Core (MVC, Web API, Minimal API), ASP.NET MVC 5, .NET Framework, Entity Framework Core, Dapper, T-SQL, SQL Server
- *Frontend:* React, TypeScript, JavaScript, Vite, Razor, HTML, CSS, Bootstrap, jQuery, AJAX
- *Cloud & Integration:* AWS (S3, EC2, RDS, ECS, Lambda, Bedrock, Textract), Keycloak (OIDC/JWT), MinIO, SignalR, Quartz.NET, Hangfire, Elsa Workflows
- *Architecture & Delivery:* System design, N-layered Architecture, Clean Architecture, Vertical Slice Architecture, REST APIs, SDLC, Agile, Waterfall, Requirements Gathering, Business Case and ROI, PRDs, ADRs, UAT
- *DevOps & Quality:* Git, GitHub Actions (CI/CD), GitVersion, IIS, Docker, Linux, integration testing, code review
- *Desktop, Reporting & Automation:* WinForms, ClickOnce, Telerik Reporting, SQL Server Reporting Services, WPF, Robotic Process Automation (RPA)
- *Additional Technologies:* Vue.js, PHP, Laravel, Arduino, C/C++

== Certifications

- AWS Certified Cloud Practitioner (CLF-C02), #link("https://www.credly.com/badges/bc1ed2db-21b9-462e-b08a-b3e727911062")[verify]
- AWS Certified AI Practitioner (AIF-C01), #link("https://www.credly.com/badges/995a969c-1ada-49e5-84de-53b483dca02f")[verify]
