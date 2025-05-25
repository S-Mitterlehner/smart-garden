using SmartGarden.Modules.Enums;

namespace SmartGarden.AutomationService.Models;

public class ModuleState
{
    public Guid ModuleId { get; set; }

    public StateType StateType { get; set; }
    public string? State { get; set; }
    public double? CurrentValue { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}