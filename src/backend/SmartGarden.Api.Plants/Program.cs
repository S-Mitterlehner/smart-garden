using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartGarden.Api.Plants.GraphQL;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Plants;
using SmartGarden.EntityFramework.Plants.Seeding;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.OpenTelemetry()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.AddControllers();

// DB
// builder.Services.RegisterDbContext(builder.Configuration);
builder.AddNpgsqlDbContext<PlantsDbContext>("plant-db"
    , s => {}
    , b => b.UseLazyLoadingProxies()
);
builder.Services.AddDbInitializerWithJsonSeeder<PlantsSeedModel, PlantsDbContext>("../Seeds/dev.seed.json");

builder.Services.AddAuthorization();
builder.Services.AddCors();


// Add services to the container.

builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    // .AddMutationType<Mutation>()
    // .AddSubscriptionType<Subscription>()
    .AddMutationConventions(applyToAllMutations: true)
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .AddApolloFederation();


var app = builder.Build();

// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

List<string> allowedHosts = ["localhost", "studio.apollographql.com"];

app.UseCors(o =>
{
    o.SetIsOriginAllowed(origin =>
    {
        var host = new Uri(origin).Host;
        return allowedHosts.Any(x => x == host);
    });
    
    o.AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials();
});

app.UseAuthentication();
app.UseAuthorization();

// app.UseWebSockets();
app.MapGraphQL();
app.MapControllers();

app.Run();
