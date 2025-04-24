using Microsoft.EntityFrameworkCore;
using MQTTnet;
using SmartGarden.Actuators;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener;
using SmartGarden.API.Services;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Seeder;
using SmartGarden.Mqtt;
using SmartGarden.Sensors;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.RegisterDbContext(builder.Configuration);

// Services
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddSingleton<ISensorManager, SensorManager>();
builder.Services.AddSingleton<ISensorListener, SignalRSensorListener>();
builder.Services.AddScoped<ISeeder, DevSeeder>();

builder.Services.AddMqttClient();

// BackgroundServices 
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddHostedService<SensorInitializer>();

if (builder.Environment.IsDevelopment()) 
    builder.Services.AddHostedService<DummyRegistrationService>();

// Options
builder.Services.Configure<MqttSettings>(builder.Configuration.GetSection("Mqtt"));

// -----
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.AddSignalR();

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

app.Run();