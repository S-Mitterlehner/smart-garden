using SmartGarden.Core.Enums;

namespace SmartGarden.EntityFramework.Models;

public class ActuatorRef : BaseEntityWithOrder
{
    public string Name { get; set; }
    public ActuatorType Type { get; set; }
    public string? ConnectorKey { get; set; }

    //public string Description { get; set; }
    //public virtual List<ActuatorAction> Actions { get; set; } = new();

    // TODO: Add Properties to connect actual Controller to app
}

//public class ActuatorAction : BaseEntityWithOrder
//{
//    public string Key { get; set; }
//    public string Name { get; set; }
//    public string Description { get; set; }
//    public ActionIcons Icon { get; set; }
//}