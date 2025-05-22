
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartGarden.ConnectorService.EntityFramework;
using SmartGarden.ConnectorService.EntityFramework.Seeder;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeder;
using SmartGarden.ExecutorService;
using SmartGarden.ExecutorService.Services;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Service;
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
builder.AddRabbitMQClient(connectionName: "messaging");

builder.Services.Configure<ModuleSettings>(builder.Configuration.GetSection("Modules"));

// Services
builder.Services.AddSingleton<IServiceModuleManager, ServiceModuleManager>();
builder.Services.AddSingleton<IModuleListener, RabbitMQModuleListener>();
builder.Services.AddSingleton<ISeeder, DevSeeder>();
builder.Services.AddSingleton<IMessageHandler<ActuatorExecutionMessageBody>, ActuatorExecutionMessageHandler>();
builder.Services.AddSingleton<IMessagingProducer, RabbitMQMessagingProducer>();

// MQTT
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));
builder.Services.AddMqttClient();

// BackgroundServices
builder.Services.AddHostedService<ConnectorManagingService>();
builder.Services.AddHostedService<DbInitializer<ConnectionServiceDbContext>>();
builder.Services.AddHostedService<MessagingListenerService<ActuatorExecutionMessage, ActuatorExecutionMessageBody>>();
builder.Services.AddHostedService<ModuleInitializerHostedService>();

await builder.Build().RunAsync();