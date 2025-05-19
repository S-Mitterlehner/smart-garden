using Microsoft.EntityFrameworkCore;
using Quartz;
using Quartz.AspNetCore;
using Serilog;
using SmartGarden.API.GraphQL;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener;
using SmartGarden.API.Services;
using SmartGarden.Automation;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Seeder;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors;
using SmartGarden.Messaging;
using SmartGarden.Mqtt;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.OpenTelemetry()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// DB
// builder.Services.RegisterDbContext(builder.Configuration);
builder.AddNpgsqlDbContext<ApplicationContext>("smartgarden"
    , s => {}
    , b => b.UseLazyLoadingProxies()
    );

// Config
builder.Services.Configure<ModuleSettings>(builder.Configuration.GetSection("Modules"));
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));

// Services
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddSingleton<SignalRActuatorListener>();
builder.Services.AddSingleton<GraphQlActuatorListener>();
builder.Services.AddSingleton<IActuatorListener, ActuatorListenerComposite>(s => 
    new ActuatorListenerComposite(
    s.GetRequiredService<SignalRActuatorListener>(),
    s.GetRequiredService<GraphQlActuatorListener>()));

builder.Services.AddSingleton<ISensorManager, SensorManager>();
builder.Services.AddSingleton<SignalRSensorListener>();
builder.Services.AddSingleton<GraphQlSensorListener>();
builder.Services.AddSingleton<RabbitMqSensorListener>();
builder.Services.AddSingleton<ISensorListener, SensorListenerComposite>(s => 
    new SensorListenerComposite(
        s.GetRequiredService<SignalRSensorListener>(),
        s.GetRequiredService<GraphQlSensorListener>(),
        s.GetRequiredService<RabbitMqSensorListener>()));

builder.Services.AddSingleton<ActionExecutor>();
builder.Services.AddSingleton<AutomationService>();
builder.Services.AddScoped<ISeeder, DevSeeder>();

builder.Services.AddMqttClient();
builder.Services.AddSignalR();

// GraphQL
builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddMutationConventions(applyToAllMutations: true)
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();
    //.AddProjections() // direct DB requests

// RabbitMQ
builder.AddRabbitMQClient(connectionName: "messaging");
builder.Services.AddMessaging(builder.Configuration.GetSection("RabbitMQ"));

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

// BackgroundServices 
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddHostedService<SensorInitializer>();
builder.Services.AddHostedService<ActuatorInitializer>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHostedService<DummyRegistrationService>();
    //builder.Services.AddHostedService<MQTTNeutralizer>();
}

// -----
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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