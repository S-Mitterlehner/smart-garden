using SmartGarden.EntityFramework.Enums;

namespace SmartGarden.EntityFramework.Models;

public class Controller : BaseEntityWithOrder
{
    public string Name { get; set; }
    public string Description { get; set; }
    public virtual List<ControllerAction> Actions { get; set; } = new();

    // TODO: Add Properties to connect actual Controller to app
}

public class ControllerAction : BaseEntityWithOrder
{
    public string Key { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ActionIcons Icon { get; set; }
}