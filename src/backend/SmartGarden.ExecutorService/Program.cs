
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using SmartGarden.EntityFramework;
using SmartGarden.ExecutorService;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules.Actuators;
using SmartGarden.Mqtt;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    // .WriteTo.OpenTelemetry()
    .CreateLogger();

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("./appsettings.json");
builder.Logging.AddSerilog();

builder.AddNpgsqlDbContext<ApplicationContext>("smartgarden"
    , s => {}
    , b => b.UseLazyLoadingProxies()
);
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddSingleton<IActuatorListener, NoOpActuatorListener>();

// MQTT
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));
builder.Services.AddMqttClient();

builder.Services.AddSingleton<IMessageHandler<ActuatorExecutionMessageBody>, ActuatorExecutionMessageHandler>();

builder.Services.AddHostedService<ListenerService<ActuatorExecutionMessage, ActuatorExecutionMessageBody>>();

builder.AddRabbitMQClient(connectionName: "messaging");
// builder.Services.AddMessaging(builder.Configuration.GetSection("RabbitMQ"));

builder.Build().Run();