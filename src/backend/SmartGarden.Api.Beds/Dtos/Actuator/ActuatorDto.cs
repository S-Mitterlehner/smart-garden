namespace SmartGarden.Api.Beds.Dtos.Actuator;

public class ActuatorDto : ActuatorRefDto
{
    public string Description { get; set; }
    public ActuatorStateDto State { get; set; }
}