using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.AspNetCore;
using Serilog;
using SmartGarden.AutomationService;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Seeder;
using SmartGarden.AutomationService.MessageHandler;
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

// RabbitMQ
builder.Services.AddSingleton<IMessagingProducer, RabbitMQMessagingProducer>();
builder.AddRabbitMQClient(connectionName: "rabbitmq");
builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));


// Quartz
builder.Services.AddQuartz(o =>
{
    var jobKey = new JobKey("Automation");
    o.AddJob<AutomationJob>(o => o.WithIdentity(jobKey));

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
builder.Services.AddSingleton<IMessageHandler<ModuleRegisterMessageBody>, ModuleRegisterMessageHandler>();

builder.Services.AddHostedService<MessagingListenerService<ModuleStateMessage, ModuleStateMessageBody>>();
builder.Services.AddHostedService<MessagingListenerService<AutomationRuleMessage, AutomationRuleMessageBody>>();
builder.Services.AddHostedService<MessagingListenerService<ModuleRegisterMessage, ModuleRegisterMessageBody>>();

await builder.Build().RunAsync();