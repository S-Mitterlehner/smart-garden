namespace SmartGarden.Automation.RulesEngine;

public class RuleResult
{
    public required string Rule { get; init; }
    public required bool IsSuccess { get; init; }
    public string? Message { get; init; }
}