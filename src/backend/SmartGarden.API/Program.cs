using Microsoft.EntityFrameworkCore;
using SmartGarden.Actuators;
using SmartGarden.API.Hubs;
using SmartGarden.API.Listener;
using SmartGarden.API.Services;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Seeder;
using SmartGarden.Sensors;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<ApplicationContext>(o =>
{
    o.UseNpgsql("Server=smartgarden.db;Port=5432;Database=smartgarden;User Id=postgres;Password=postgres;");
});

// Services
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddSingleton<ISensorManager, SensorManager>();
builder.Services.AddSingleton<ISensorListener, SignalRSensorListener>();
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddScoped<ISeeder, DevSeeder>();

if (builder.Environment.IsDevelopment()) 
    builder.Services.AddHostedService<DummyRegistrationService>();

// Options
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("Database"));

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