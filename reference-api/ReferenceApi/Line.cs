using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace ReferenceApi;

/// <summary>State of the simulated production line (synthetic data only).</summary>
public sealed record LineState(int Produced, int Target, int Adjustments, int Tick)
{
    public static LineState Initial() => new(0, 600, 0, 0);
}

public sealed record LineUpdate(int Produced, int Target, int Adjustments, int Tick, int AdjustRate);

/// <summary>One step of the simulation: the same rules as the browser demo (src/demo/simulation.ts).</summary>
public static class LineSimulation
{
    public static (LineState State, LineUpdate Update) Step(LineState previous, Random random)
    {
        var made = 1 + random.Next(4);
        var produced = Math.Min(previous.Target, previous.Produced + made);
        var adjusted = random.NextDouble() < 0.12;
        var adjustments = previous.Adjustments + (adjusted ? 1 : 0);
        var tick = previous.Tick + 1;

        var next = produced >= previous.Target ? LineState.Initial() : new LineState(produced, previous.Target, adjustments, tick);
        var rate = produced > 0 ? (int)Math.Round(adjustments / (double)Math.Max(1, (int)Math.Ceiling(produced / 4.0)) * 100) : 0;
        return (next, new LineUpdate(produced, previous.Target, adjustments, tick, rate));
    }
}

/// <summary>Clients connect to /hubs/line and receive an "update" message every interval, like a SignalR dashboard.</summary>
public sealed class LineHub : Hub;

public sealed class LineOptions
{
    public int IntervalMs { get; set; } = 1000;
}

public sealed class LineBroadcaster(IHubContext<LineHub> hub, IOptions<LineOptions> options) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var state = LineState.Initial();
        var random = new Random();
        using var timer = new PeriodicTimer(TimeSpan.FromMilliseconds(Math.Max(10, options.Value.IntervalMs)));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            var (next, update) = LineSimulation.Step(state, random);
            state = next;
            await hub.Clients.All.SendAsync("update", update, stoppingToken);
        }
    }
}
