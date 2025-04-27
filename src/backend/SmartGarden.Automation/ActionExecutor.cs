using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Automation;

public class ActionExecutor
{
    public async Task ExecuteActionAsync(AutomationRuleAction action)
    {
        Console.WriteLine($"Action {action.Id} is executed");
    }
}