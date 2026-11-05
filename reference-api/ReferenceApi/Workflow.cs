namespace ReferenceApi;

public enum RequestState { Submitted, InReview, Approved, Rejected }

public enum WorkflowAction { Review, Approve, Reject }

public sealed record ChangeRequest(string Id, string Title, RequestState State, DateTimeOffset CreatedAt);

/// <summary>
/// The approval rules, kept free of HTTP so they can be tested on their own.
/// They are the same rules as the browser demo on the portfolio site (src/demo/workflow.ts).
/// </summary>
public static class WorkflowRules
{
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 80;

    /// <summary>Trims and collapses whitespace; the title must then be 3 to 80 characters.</summary>
    public static bool TryNormalizeTitle(string? raw, out string title, out string? error)
    {
        title = string.Join(' ', (raw ?? string.Empty).Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
        if (title.Length is < MinTitleLength or > MaxTitleLength)
        {
            error = $"Title must be {MinTitleLength} to {MaxTitleLength} characters.";
            return false;
        }

        error = null;
        return true;
    }

    /// <summary>The state after an action, or null when the action is not allowed in the current state.</summary>
    public static RequestState? Next(RequestState state, WorkflowAction action) => (state, action) switch
    {
        (RequestState.Submitted, WorkflowAction.Review) => RequestState.InReview,
        (RequestState.Submitted, WorkflowAction.Reject) => RequestState.Rejected,
        (RequestState.InReview, WorkflowAction.Approve) => RequestState.Approved,
        (RequestState.InReview, WorkflowAction.Reject) => RequestState.Rejected,
        _ => null,
    };
}

public enum TransitionResult { Ok, NotFound, NotAllowed }

/// <summary>Thread-safe in-memory store. In a real system this sits behind a repository backed by EF Core and SQL Server.</summary>
public sealed class RequestStore
{
    private readonly object _gate = new();
    private readonly List<ChangeRequest> _items = [];
    private long _next;

    public IReadOnlyList<ChangeRequest> All()
    {
        lock (_gate) return _items.OrderByDescending(r => r.CreatedAt).ThenByDescending(r => r.Id, StringComparer.Ordinal).ToList();
    }

    public ChangeRequest Add(string title)
    {
        lock (_gate)
        {
            var item = new ChangeRequest($"r{++_next}", title, RequestState.Submitted, DateTimeOffset.UtcNow);
            _items.Add(item);
            return item;
        }
    }

    public TransitionResult Transition(string id, WorkflowAction action, out ChangeRequest? updated)
    {
        lock (_gate)
        {
            updated = null;
            var index = _items.FindIndex(r => r.Id == id);
            if (index < 0) return TransitionResult.NotFound;
            var next = WorkflowRules.Next(_items[index].State, action);
            if (next is null) return TransitionResult.NotAllowed;
            updated = _items[index] with { State = next.Value };
            _items[index] = updated;
            return TransitionResult.Ok;
        }
    }

    public void Clear()
    {
        lock (_gate)
        {
            _items.Clear();
            _next = 0;
        }
    }
}
