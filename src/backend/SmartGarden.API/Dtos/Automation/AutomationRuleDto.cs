using System.Linq.Expressions;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.API.Dtos.Automation;

public class AutomationRuleDto : BaseDto
{
    public Guid BedId { get; set; }
    public string Name { get; set; }
    public string ExpressionJson { get; set; }
    public List<AutomationRuleActionDto>? Actions { get; set; } = new();

    public static Expression<Func<AutomationRule, AutomationRuleDto>> FromEntity => r => 
        new AutomationRuleDto
        {
            Id = r.Id,
            BedId = r.BedId,
            Name = r.Name,
            ExpressionJson = r.ExpressionJson,
            Actions = r.Actions.AsQueryable().Select(AutomationRuleActionDto.FromEntity).ToList()
        };
}