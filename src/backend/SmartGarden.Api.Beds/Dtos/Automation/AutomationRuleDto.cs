using System.Linq.Expressions;
using SmartGarden.Api.Core.Dtos;
using SmartGarden.EntityFramework.Beds.Models;

namespace SmartGarden.Api.Beds.Dtos.Automation;

public class AutomationRuleDto : BaseDto
{
    public Guid BedId { get; set; }
    public string Name { get; set; }
    public string ExpressionJson { get; set; }
    public bool IsEnabled { get; set; }
    public List<AutomationRuleActionDto>? Actions { get; set; } = new();

    public static Expression<Func<AutomationRule, AutomationRuleDto>> FromEntity => r => 
        new AutomationRuleDto
        {
            Id = r.Id,
            BedId = r.BedId,
            Name = r.Name,
            IsEnabled = r.IsEnabled,
            ExpressionJson = r.ExpressionJson,
            Actions = r.Actions.AsQueryable().Select(AutomationRuleActionDto.FromEntity).ToList()
        };
}