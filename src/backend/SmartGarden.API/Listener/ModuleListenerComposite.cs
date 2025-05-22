using SmartGarden.Modules;
using SmartGarden.Modules.Models;

namespace SmartGarden.API.Listener;

public class ModuleListenerComposite(ILogger<ModuleListenerComposite> logger, params IModuleListener[] listeners) : IModuleListener
{
    public async Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions)
    {
        var actionList = actions.ToList(); // ToList() to avoid multiple enumerations

        foreach (var l in listeners)
        {
            try
            {
                await l.PublishStateChangeAsync(data, actionList);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in listener {listener}: {message}", l.GetType().Name, ex.Message);
            }
        }
    }
}