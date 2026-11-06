# Reference API (ASP.NET Core)

A small, real back end: an approval workflow and a live production-line feed on ASP.NET Core minimal APIs, SignalR, and automated tests. GitHub Pages can only host static files, so the portfolio site cannot run it; this folder shows the same ideas on the actual stack. (It was first modelled on a live demo that ran in the browser; that demo was removed from the site on 2026-11-06.) It is **not deployed**; run it locally.

| What | How |
|---|---|
| Approval workflow | `POST /api/requests`, `POST /api/requests/{id}/{review\|approve\|reject}`; state machine and validation in `Workflow.cs`; 400, 404 and 409 answers |
| Simulated production line | SignalR hub at `/hubs/line` pushing an `update` message every second (`Line.cs`) |
| Data | All data is synthetic; nothing here comes from a real system |

## Run it

Requires the .NET 10 SDK.

```bash
dotnet run --project reference-api/ReferenceApi      # http://localhost:5000 (see the console for the port)
dotnet test reference-api                             # unit and end-to-end tests
```

Try it:

```bash
curl -X POST http://localhost:5000/api/requests -H "Content-Type: application/json" -d '{"title":"Update line 3 program"}'
curl -X POST http://localhost:5000/api/requests/r1/review
curl http://localhost:5000/api/requests
```

## Endpoints

| Method and path | Result |
|---|---|
| `GET /health` | `200 { "status": "ok" }` |
| `GET /api/requests` | All requests, newest first |
| `POST /api/requests` with `{ "title": "..." }` | `201` with the request, or `400` validation problem (title must be 3 to 80 characters) |
| `POST /api/requests/{id}/review`, `/approve`, `/reject` | `200` with the updated request; `404` unknown id; `409` when the action is not allowed in the current state; `400` unknown action |
| `DELETE /api/requests` | `204`, clears everything (used by the tests) |
| `/hubs/line` (SignalR) | `update` messages: `{ produced, target, adjustments, tick, adjustRate }` |

Allowed transitions: submitted, then review, then approve; reject is allowed from submitted and from in review. Approved and rejected are final.

## How it is tested

- `RulesTests.cs`: the workflow rules and the line simulation on their own.
- `ApiTests.cs`: the real application started in memory with `WebApplicationFactory<Program>` and called over HTTP and SignalR (long polling in memory), covering create, list, validation, the full approval path, conflicts, unknown ids and actions, and live updates.

CI (`.github/workflows/deploy.yml`, job `api`) runs `dotnet test` and the site is only deployed when it passes.

## What a production version would add

A real database (EF Core with SQL Server) behind a repository instead of the in-memory store, authentication (Keycloak or OpenID Connect), structured logging, and a CORS policy for the web front end. They are left out on purpose to keep the example small and readable.
