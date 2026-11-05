using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.TestHost;
using Xunit;

namespace ReferenceApi.Tests;

/// <summary>End-to-end tests: the real application runs in memory and is called over HTTP and SignalR.</summary>
public class ApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory = factory.WithWebHostBuilder(b => b.UseSetting("Line:IntervalMs", "30"));

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    private async Task<HttpClient> FreshClient()
    {
        var client = _factory.CreateClient();
        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync("/api/requests")).StatusCode);
        return client;
    }

    private static async Task<ChangeRequestDto> Read(HttpResponseMessage response) =>
        (await response.Content.ReadFromJsonAsync<ChangeRequestDto>(Json))!;

    private sealed record ChangeRequestDto(string Id, string Title, string State);

    [Fact]
    public async Task Health_endpoint_answers_ok()
    {
        var res = await _factory.CreateClient().GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        Assert.Contains("ok", await res.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task A_request_can_be_created_and_listed()
    {
        var client = await FreshClient();
        var created = await client.PostAsJsonAsync("/api/requests", new { title = "  Update line 3 program " });

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var item = await Read(created);
        Assert.Equal("Update line 3 program", item.Title);
        Assert.Equal("Submitted", item.State);
        Assert.NotNull(created.Headers.Location);

        var list = await client.GetFromJsonAsync<List<ChangeRequestDto>>("/api/requests", Json);
        Assert.Single(list!);
    }

    [Theory]
    [InlineData("ab")]
    [InlineData("")]
    public async Task Invalid_titles_are_rejected_with_a_validation_problem(string title)
    {
        var client = await FreshClient();
        var res = await client.PostAsJsonAsync("/api/requests", new { title });
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        Assert.Contains("title", await res.Content.ReadAsStringAsync());
        Assert.Empty((await client.GetFromJsonAsync<List<ChangeRequestDto>>("/api/requests", Json))!);
    }

    [Fact]
    public async Task A_request_moves_through_review_to_approval()
    {
        var client = await FreshClient();
        var item = await Read(await client.PostAsJsonAsync("/api/requests", new { title = "Change 1" }));

        var reviewed = await Read(await client.PostAsync($"/api/requests/{item.Id}/review", null));
        Assert.Equal("InReview", reviewed.State);

        var approved = await Read(await client.PostAsync($"/api/requests/{item.Id}/approve", null));
        Assert.Equal("Approved", approved.State);
    }

    [Fact]
    public async Task A_transition_that_is_not_allowed_is_a_conflict_and_changes_nothing()
    {
        var client = await FreshClient();
        var item = await Read(await client.PostAsJsonAsync("/api/requests", new { title = "Change 2" }));

        var res = await client.PostAsync($"/api/requests/{item.Id}/approve", null); // cannot approve before review
        Assert.Equal(HttpStatusCode.Conflict, res.StatusCode);

        var list = await client.GetFromJsonAsync<List<ChangeRequestDto>>("/api/requests", Json);
        Assert.Equal("Submitted", list![0].State);
    }

    [Fact]
    public async Task Unknown_ids_and_actions_are_reported()
    {
        var client = await FreshClient();
        Assert.Equal(HttpStatusCode.NotFound, (await client.PostAsync("/api/requests/nope/review", null)).StatusCode);

        var item = await Read(await client.PostAsJsonAsync("/api/requests", new { title = "Change 3" }));
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsync($"/api/requests/{item.Id}/explode", null)).StatusCode);
    }

    [Fact]
    public async Task The_production_line_streams_updates_over_SignalR()
    {
        var server = _factory.Server;
        var received = new TaskCompletionSource<JsonElement>(TaskCreationOptions.RunContinuationsAsynchronously);

        await using var connection = new HubConnectionBuilder()
            .WithUrl(new Uri(server.BaseAddress, "/hubs/line"), o =>
            {
                o.HttpMessageHandlerFactory = _ => server.CreateHandler();
                o.Transports = HttpTransportType.LongPolling; // WebSockets need a real socket; long polling works in memory
            })
            .Build();
        connection.On<JsonElement>("update", update => received.TrySetResult(update));

        await connection.StartAsync();
        var update = await received.Task.WaitAsync(TimeSpan.FromSeconds(10));

        Assert.True(update.GetProperty("target").GetInt32() > 0);
        Assert.InRange(update.GetProperty("produced").GetInt32(), 0, update.GetProperty("target").GetInt32());
    }
}
