using SmartGarden.Actuators.Models;

namespace SmartGarden.API.Dtos.Actuator;

public class ActuatorStateDto
{
    public string Type { get; set; }
    public string? State { get; set; }
    public double? Value { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }

    public static ActuatorStateDto FromState(ActuatorState state)
    {
        if (state is DiscreteActuatorState ds)
            return new ActuatorStateDto {State = ds.State, Type = ds.Type.ToString()};
        if (state is ContinuousActuatorState cs)
            return new ActuatorStateDto
            {
                Type = cs.Type.ToString(),
                Value = cs.CurrentValue,
                Min = cs.MinValue,
                Max = cs.MaxValue,
                Unit = cs.Unit
            };

        throw new ArgumentException("Invalid actuator state type", nameof(state));
    }
}