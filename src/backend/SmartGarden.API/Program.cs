using Quartz;
using Quartz.AspNetCore;
using SmartGarden.API;
using SmartGarden.API.Dtos;
using SmartGarden.API.GraphQL;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener;
using SmartGarden.API.Services;
using SmartGarden.Automation;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.EntityFramework.Seeder;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors;
using SmartGarden.Mqtt;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.RegisterDbContext(builder.Configuration);

// Config
builder.Services.Configure<ModuleSettings>(builder.Configuration.GetSection("Modules"));

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
builder.Services.AddSingleton<ISensorListener, SensorListenerComposite>(s => 
    new SensorListenerComposite(
        s.GetRequiredService<SignalRSensorListener>(),
        s.GetRequiredService<GraphQlSensorListener>()));

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

// Options
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));

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
app.UseWebSockets();
app.MapGraphQL();

// app.UseHttpsRedirection();
app.UseCors(o => o.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials());

app.UseAuthorization();

app.MapControllers();
app.MapHub<SensorHub>("/sockets/sensor");
app.MapHub<ActuatorHub>("/sockets/actuator");

app.Run();