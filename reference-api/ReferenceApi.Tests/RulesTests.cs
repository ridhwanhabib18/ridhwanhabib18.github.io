using ReferenceApi;
using Xunit;

namespace ReferenceApi.Tests;

public class WorkflowRulesTests
{
    [Theory]
    [InlineData("ab", false)]
    [InlineData("   ", false)]
    [InlineData(null, false)]
    [InlineData("abc", true)]
    [InlineData("Update line 3 program", true)]
    public void Titles_are_validated(string? raw, bool valid)
    {
        Assert.Equal(valid, WorkflowRules.TryNormalizeTitle(raw, out _, out var error));
        Assert.Equal(valid, error is null);
    }

    [Fact]
    public void Titles_longer_than_80_characters_are_rejected()
    {
        Assert.False(WorkflowRules.TryNormalizeTitle(new string('x', 81), out _, out _));
        Assert.True(WorkflowRules.TryNormalizeTitle(new string('x', 80), out _, out _));
    }

    [Fact]
    public void Whitespace_is_trimmed_and_collapsed()
    {
        Assert.True(WorkflowRules.TryNormalizeTitle("  Valid    title ", out var title, out _));
        Assert.Equal("Valid title", title);
    }

    [Theory]
    [InlineData(RequestState.Submitted, WorkflowAction.Review, RequestState.InReview)]
    [InlineData(RequestState.Submitted, WorkflowAction.Reject, RequestState.Rejected)]
    [InlineData(RequestState.InReview, WorkflowAction.Approve, RequestState.Approved)]
    [InlineData(RequestState.InReview, WorkflowAction.Reject, RequestState.Rejected)]
    public void Allowed_transitions(RequestState from, WorkflowAction action, RequestState to) =>
        Assert.Equal(to, WorkflowRules.Next(from, action));

    [Theory]
    [InlineData(RequestState.Submitted, WorkflowAction.Approve)]
    [InlineData(RequestState.InReview, WorkflowAction.Review)]
    [InlineData(RequestState.Approved, WorkflowAction.Reject)]
    [InlineData(RequestState.Rejected, WorkflowAction.Review)]
    public void Everything_else_is_refused(RequestState from, WorkflowAction action) =>
        Assert.Null(WorkflowRules.Next(from, action));
}

public class LineSimulationTests
{
    [Fact]
    public void Production_never_exceeds_the_target_and_the_plan_restarts_when_complete()
    {
        var random = new Random(42);
        var state = LineState.Initial();
        var restarts = 0;
        for (var i = 0; i < 1000; i++)
        {
            var (next, update) = LineSimulation.Step(state, random);
            Assert.InRange(update.Produced, 0, update.Target);
            if (next.Tick == 0) restarts++;
            state = next;
        }

        Assert.True(restarts >= 1);
    }

    [Fact]
    public void A_plan_about_to_finish_restarts()
    {
        var (next, update) = LineSimulation.Step(new LineState(599, 600, 3, 10), new Random(1));
        Assert.Equal(600, update.Produced);
        Assert.Equal(LineState.Initial(), next);
    }
}
