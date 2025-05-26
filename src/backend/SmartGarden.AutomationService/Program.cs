using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartGarden.AutomationService;
using SmartGarden.AutomationService.EntityFramework;
using SmartGarden.AutomationService.EntityFramework.Seeding;
using SmartGarden.AutomationService.MessageHandler;
using SmartGarden.EntityFramework.Core;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Messaging.Models;
using SmartGarden.Scheduling;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Debug()
             .Enrich.FromLogContext()
             .WriteTo.Console()
             .WriteTo.OpenTelemetry()
             .CreateLogger();

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("./appsettings.json");
builder.Logging.AddSerilog();

// DB
builder.AddNpgsqlDbContext<AutomationServiceDbContext>("smartgarden-automation-service"
    , s => {}
    , b => b.UseLazyLoadingProxies()
);
builder.Services.AddDbInitializerWithJsonSeeder<AutomationServiceSeedModel, AutomationServiceDbContext>("./dev.seed.json");

// RabbitMQ
builder.Services.AddSingleton<IMessagingProducer, RabbitMQMessagingProducer>();
builder.AddRabbitMQClient(connectionName: "rabbitmq");
builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));


// Quartz
builder.Services.AddScheduler(b =>
{
    b.AddJobAdvanced<AutomationJob>(TimeSpan.FromMinutes(1));
});

// Services
builder.Services.AddMemoryCache();

// BackgroundServices
builder.Services.AddSingleton<IMessageHandler<ModuleStateMessageBody>, ModuleStateMessageHandler>();
builder.Services.AddSingleton<IMessageHandler<ModuleRegisterMessageBody>, ModuleRegisterMessageHandler>();
builder.Services.AddSingleton<IMessageHandler<AutomationRuleMessageBody>, AutomationRuleMessageHandler>();

builder.Services.AddHostedService<MessagingListenerService<ModuleStateMessage, ModuleStateMessageBody>>();
builder.Services.AddHostedService<MessagingListenerService<AutomationRuleMessage, AutomationRuleMessageBody>>();
builder.Services.AddHostedService<MessagingListenerService<ModuleRegisterMessage, ModuleRegisterMessageBody>>();

await builder.Build().RunAsync();