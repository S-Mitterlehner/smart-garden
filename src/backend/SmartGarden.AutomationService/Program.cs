using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.AspNetCore;
using Serilog;
using SmartGarden.Automation;
using SmartGarden.AutomationService;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Seeder;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeder;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Messaging.Models;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.OpenTelemetry()
    .CreateLogger();

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("./appsettings.json");
builder.Logging.AddSerilog();

builder.AddNpgsqlDbContext<AutomationServiceDbContext>("smartgarden-automation-service"
    , s => {}
    , b => b.UseLazyLoadingProxies()
);
builder.AddRabbitMQClient(connectionName: "messaging");

builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));
// Automation
builder.Services.AddQuartz(o =>
{
    var jobKey = new JobKey("Automation");
    o.AddJob<AutomationService>(o => o.WithIdentity(jobKey));

    o.AddTrigger(op =>
    {
        op.ForJob(jobKey)
            .WithIdentity("AutomationTrigger")
            .WithCronSchedule("0 * * ? * * *");
    });
});
builder.Services.AddQuartzServer(options =>
{
    options.WaitForJobsToComplete = true;
});

// Services
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ActionExecutor>();

// BackgroundServices
builder.Services.AddSingleton<ISeeder, DevSeeder>();
builder.Services.AddHostedService<DbInitializer<AutomationServiceDbContext>>();

builder.Services.AddSingleton<IMessageHandler<ModuleStateMessageBody>, ModuleStateMessageHandler>();
builder.Services.AddSingleton<IMessageHandler<AutomationRuleMessageBody>, AutomationRuleMessageHandler>();
builder.Services.AddHostedService<MessagingListenerService<ModuleStateMessage, ModuleStateMessageBody>>();
builder.Services.AddHostedService<MessagingListenerService<AutomationRuleMessage, AutomationRuleMessageBody>>();

await builder.Build().RunAsync();