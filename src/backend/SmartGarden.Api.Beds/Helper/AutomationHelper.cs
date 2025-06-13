using SmartGarden.Modules.Enums;
using SmartGarden.Modules.Models;

namespace SmartGarden.Api.Beds.Helper;

public static class AutomationHelper
{
    public static IEnumerable<AutomationConfig> GetMiscAutomationConfig() =>
    [
        new AutomationConfig
        {
            Key = "misc.CurrentTime",
            Group = "misc",
            Label = "Current Time",
            Min = 0,
            Max = TimeSpan.FromHours(24).TotalMilliseconds,
            Unit = "ms",
            ValueType = StateType.Continuous,
            TsType = "time"
        }
    ];
}