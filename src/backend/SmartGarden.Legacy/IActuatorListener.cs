namespace SmartGarden.Legacy;

[Obsolete("Please change implementation accordingly")]
public interface IActuatorListener
{
    public Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions);
}