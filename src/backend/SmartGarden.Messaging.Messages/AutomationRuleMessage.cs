using RabbitMQ.Client;

namespace SmartGarden.Messaging.Messages;

public class AutomationRuleMessage(AutomationRuleMessageBody data) : IMessage<AutomationRuleMessageBody>
{
    public static string Exchange => "AutomationRule_Exchange";
    public static ulong? Expiration => null;
    public static DeliveryModes DeliveryMode => DeliveryModes.Transient;
    public static string GetQueueName(string clientId) => $"{clientId}_AutomationRule_Queue";
    
    public string? CorrelationId => Data.Id.ToString();
    public AutomationRuleMessageBody Data => data;
}

public class AutomationRuleMessageBody
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string ExpressionJson { get; set; }

    public bool IsEnabled { get; set; } = true;

    public DateTime? LastActionRunAt { get; set; }

    public TimeSpan CoolDown { get; set; }
    
    public virtual List<AutomationRuleActionMesssageItem> Actions { get; set; } = new();
}

public class AutomationRuleActionMesssageItem
{
    public Guid ModuleId { get; set; }
    public string ActionKey { get; set; }
    public double? Value { get; set; }
}