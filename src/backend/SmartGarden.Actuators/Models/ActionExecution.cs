namespace SmartGarden.Actuators.Models;

public abstract class ActionExecution
{
    public string Key { get; set; }
}

public class CommandActionExecution : ActionExecution;

public class ValueActionExecution : ActionExecution
{
    public double Value { get; set; }
}