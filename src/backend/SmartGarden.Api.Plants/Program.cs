using System.Text.Json;
using System.Text.Json.Serialization;
using GrpcServiceClient;
using Microsoft.AspNetCore.Authentication;
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

// Add GRPC auth client
builder.Services.AddGrpcClient<Grpc.AuthGrpc.AuthGrpcClient>(options =>
{
    options.Address = new Uri("http://localhost:5036");
});
builder.Services.AddScoped<IAuthGrpcValidator, AuthGrpcValidator>();

builder.Services.AddAuthentication("GrpcScheme")
    .AddScheme<AuthenticationSchemeOptions, GrpcTokenAuthenticationHandler>("GrpcScheme", null);
builder.Services.AddAuthorization();


// Add services to the container.

builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    // .AddMutationType<Mutation>()
    // .AddSubscriptionType<Subscription>()
    .AddMutationConventions(applyToAllMutations: true)
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();


var app = builder.Build();

// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

app.UseCors(o =>
{
    o.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost");
    
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
