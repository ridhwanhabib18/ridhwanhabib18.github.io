using System.Text.Json.Serialization;
using ReferenceApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<RequestStore>();
builder.Services.AddSignalR();
builder.Services.Configure<LineOptions>(builder.Configuration.GetSection("Line"));
builder.Services.AddHostedService<LineBroadcaster>();
builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var api = app.MapGroup("/api/requests");

api.MapGet("/", (RequestStore store) => Results.Ok(store.All()));

api.MapPost("/", (CreateRequest body, RequestStore store) =>
{
    if (!WorkflowRules.TryNormalizeTitle(body.Title, out var title, out var error))
        return Results.ValidationProblem(new Dictionary<string, string[]> { ["title"] = [error!] });

    var created = store.Add(title);
    return Results.Created($"/api/requests/{created.Id}", created);
});

api.MapPost("/{id}/{action}", (string id, string action, RequestStore store) =>
{
    if (!Enum.TryParse<WorkflowAction>(action, ignoreCase: true, out var parsed) || !Enum.IsDefined(parsed))
        return Results.Problem($"Unknown action '{action}'. Use review, approve or reject.", statusCode: StatusCodes.Status400BadRequest);

    return store.Transition(id, parsed, out var updated) switch
    {
        TransitionResult.Ok => Results.Ok(updated),
        TransitionResult.NotFound => Results.Problem($"No request with id '{id}'.", statusCode: StatusCodes.Status404NotFound),
        _ => Results.Problem($"'{parsed}' is not allowed for this request in its current state.", statusCode: StatusCodes.Status409Conflict),
    };
});

api.MapDelete("/", (RequestStore store) =>
{
    store.Clear();
    return Results.NoContent();
});

app.MapHub<LineHub>("/hubs/line");

app.Run();

public sealed record CreateRequest(string? Title);

// Lets the integration tests start the application in memory (WebApplicationFactory<Program>).
public partial class Program;
