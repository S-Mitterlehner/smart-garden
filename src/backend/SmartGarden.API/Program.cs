using Microsoft.EntityFrameworkCore;
using SmartGarden.Actuators;
using SmartGarden.API.Services;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Seeder;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<ApplicationContext>(o =>
{
    o.UseNpgsql("Server=smartgarden.db;Port=5432;Database=smartgarden;User Id=postgres;Password=postgres;");
});

// Services
builder.Services.AddSingleton<IActuatorManager, ActuatorManager>();
builder.Services.AddHostedService<DbInitializer>();
builder.Services.AddScoped<ISeeder, DevSeeder>();

// Options
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("Database"));

// -----
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(o => o.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseAuthorization();

app.MapControllers();

app.Run();