using Microsoft.EntityFrameworkCore;
using MQTTnet;
using Quartz;
using Quartz.AspNetCore;
using SmartGarden.Actuators;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener;
using SmartGarden.API.Services;
using SmartGarden.Automation;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Seeder;
using SmartGarden.Mqtt;
using SmartGarden.Sensors;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.RegisterDbContext(builder.Configuration);

// Services
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddSingleton<IActuatorListener, SignalRActuatorListener>();
builder.Services.AddSingleton<ISensorManager, SensorManager>();
builder.Services.AddSingleton<ISensorListener, SignalRSensorListener>();
builder.Services.AddSingleton<ActionExecutor>();
builder.Services.AddScoped<ISeeder, DevSeeder>();

builder.Services.AddMqttClient();
builder.Services.AddSignalR();
builder.Services.AddQuartz(o =>
{
    var jobKey = new JobKey("Automation");
    o.AddJob<AutomationService>(o => o.WithIdentity(jobKey));

    o.AddTrigger(o =>
    {
        o.ForJob(jobKey)
            .WithIdentity("AutomationTrigger")
            .WithCronSchedule("0/0 * * ? * * *");
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

app.UseHttpsRedirection();
app.UseCors(o => o.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials());

app.UseAuthorization();

app.MapControllers();
app.MapHub<SensorHub>("/sockets/sensor");
app.MapHub<ActuatorHub>("/sockets/actuator");

app.Run();