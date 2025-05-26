using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartGarden.API.GraphQL;
using SmartGarden.API.Hubs;
using SmartGarden.API.Jobs;
using SmartGarden.API.Listener;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Seeding;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Sensors;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Api;
using SmartGarden.Modules.Service.Models;
using SmartGarden.Scheduling;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Debug()
             .Enrich.FromLogContext()
             .WriteTo.Console()
             .WriteTo.OpenTelemetry()
             .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// DB
// builder.Services.RegisterDbContext(builder.Configuration);
builder.AddNpgsqlDbContext<ApplicationDbContext>("smartgarden-api"
    , s => {}
    , b => b.UseLazyLoadingProxies()
    );
builder.Services.AddDbInitializerWithJsonSeeder<ApiSeedModel, ApplicationDbContext>("../Seeds/dev.seed.json");

builder.AddRedisClient(connectionName: "redis-api");

// Config
builder.Services.Configure<ModuleSettings>(builder.Configuration.GetSection("Modules"));

// Services
builder.Services.AddSingleton<IApiModuleManager, ApiModuleManager>();
builder.Services.AddSingleton<IModuleListener, LegacyModuleListenerProxy>();

builder.Services.AddSingleton<SignalRActuatorListener>();
builder.Services.AddSingleton<GraphQlActuatorListener>();
builder.Services.AddSingleton<IActuatorListener, ActuatorListenerComposite>(s => 
    new ActuatorListenerComposite(
    s.GetRequiredService<SignalRActuatorListener>(),
    s.GetRequiredService<GraphQlActuatorListener>()));

builder.Services.AddSingleton<SignalRSensorListener>();
builder.Services.AddSingleton<GraphQlSensorListener>();
builder.Services.AddSingleton<ISensorListener, SensorListenerComposite>(s => 
    new SensorListenerComposite(
        s.GetRequiredService<SignalRSensorListener>(),
        s.GetRequiredService<GraphQlSensorListener>()));


// SignalR
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters
            .Add(new JsonStringEnumConverter(JsonNamingPolicy.KebabCaseUpper));
    });

// GraphQL
builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddMutationConventions(applyToAllMutations: true)
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();

// RabbitMQ
builder.AddRabbitMQClient(connectionName: "rabbitmq");
builder.Services.AddMessaging(builder.Configuration.GetSection("RabbitMQ"));

builder.Services.AddSingleton<IMessageHandler<ModuleStateMessageBody>, ModuleStateMessageHandler>();
builder.Services.AddHostedService<MessagingListenerService<ModuleStateMessage, ModuleStateMessageBody>>();

builder.Services.AddSingleton<IMessageHandler<ModuleRegisterMessageBody>, RegisterModuleMessageHandler>();
builder.Services.AddHostedService<MessagingListenerService<ModuleRegisterMessage, ModuleRegisterMessageBody>>();

// Scheduled Services
builder.Services.AddScheduler(b =>
{
    b.AddJobAdvanced<AutomationRuleSyncJob>(TimeSpan.FromMinutes(5));
});

// -----
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(o =>
{
    o.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost");
    
    o.AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials();
});

app.UseWebSockets();
app.MapGraphQL();

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<SensorHub>("/sockets/sensor");
app.MapHub<ActuatorHub>("/sockets/actuator");

app.Run();