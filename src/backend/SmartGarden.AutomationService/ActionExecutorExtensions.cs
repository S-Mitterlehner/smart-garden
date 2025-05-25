using SmartGarden.AutomationService.EntityFramework.Models;

namespace SmartGarden.AutomationService;

public static class ActionExecutorExtensions
{
    public static async Task ExecuteActionsAsync(this ActionExecutor executor, IEnumerable<AutomationRuleAction> actions)
    {
        foreach (var action in actions)
        {
            await executor.ExecuteActionAsync(action);
        }
    }
}