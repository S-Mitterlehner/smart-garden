
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartGarden.ConnectorService;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Seeding;
using SmartGarden.ConnectorService.Services;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Messaging.Models;
using SmartGarden.Modules;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Service;
using SmartGarden.Modules.Service.Models;
using SmartGarden.Mqtt;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.OpenTelemetry()
    .CreateLogger();

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("./appsettings.json");
builder.Logging.AddSerilog();

builder.AddNpgsqlDbContext<ConnectionServiceDbContext>("smartgarden-connection-service"
    , s => {}
    , b => b.UseLazyLoadingProxies()
);
builder.Services.AddDbInitializerWithJsonSeeder<ConnectionServiceSeedModel, ConnectionServiceDbContext>("./dev.seed.json");

builder.AddRabbitMQClient(connectionName: "rabbitmq");

builder.Services.Configure<ModuleSettings>(builder.Configuration.GetSection("Modules"));
builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));

// Services
builder.Services.AddSingleton<IServiceModuleManager, ServiceModuleManager>();
builder.Services.AddSingleton<IModuleListener, RabbitMQModuleListener>();
builder.Services.AddSingleton<IMessageHandler<ActionExecutionMessageBody>, ActuatorExecutionMessageHandler>();
builder.Services.AddSingleton<IMessagingProducer, RabbitMQMessagingProducer>();

// MQTT
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));
builder.Services.AddMqttClient();

// BackgroundServices
builder.Services.AddHostedService<ConnectorManagingService>();
builder.Services.AddHostedService<MessagingListenerService<ActionExecutionMessage, ActionExecutionMessageBody>>();
builder.Services.AddHostedService<ModuleInitializerHostedService>();

await builder.Build().RunAsync();