using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Services;
using SmartGarden.DataAccess;
using SmartGarden.DataAccess.Seeder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationContext>(o =>
{
    o.UseNpgsql("Server=smartgarden.db;Port=5432;Database=smartgarden;User Id=postgres;Password=postgres;");
});

builder.Services.AddScoped<ISeeder, DevSeeder>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<DbInitializer>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
