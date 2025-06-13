namespace SmartGarden.Api.Beds.Dtos.Sensor;

public class SensorDto : SensorRefDto
{
    public string Description { get; set; }
    public double? CurrentValue { get; set; }
    public double? MinValue { get; set; }
    public double? MaxValue { get; set; }
    public string? Unit { get; set; }
}