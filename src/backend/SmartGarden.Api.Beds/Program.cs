using System.Text.Json;
using System.Text.Json.Serialization;
using GrpcServiceClient;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartGarden.Api.Beds.GraphQL;
using SmartGarden.Api.Beds.Hubs;
using SmartGarden.Api.Beds.Jobs;
using SmartGarden.Api.Beds.Listener;
using SmartGarden.Api.Beds.Listener.Legacy;
using SmartGarden.EntityFramework.Beds;
using SmartGarden.EntityFramework.Beds.Seeding;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Sensors;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Api;
using SmartGarden.Scheduling;
using Medallion.Threading;
using Medallion.Threading.Redis;
using SmartGarden.Api.Core;
using SmartGarden.EntityFramework.Distributed;
using StackExchange.Redis;

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
builder.AddNpgsqlDbContext<ApplicationDbContext>("bed-db"
    , s => {}
    , b => b.UseLazyLoadingProxies()
    );
builder.Services.AddDistributedDbInitializerWithJsonSeeder<BedsSeedModel, ApplicationDbContext>("../Seeds/dev.seed.json");

builder.AddRedisClient(connectionName: "redis-api");
builder.Services.AddSingleton<IDistributedLockProvider>(sp =>
{
    var redis = sp.GetRequiredService<IConnectionMultiplexer>();
    var db = redis.GetDatabase();
    return new RedisDistributedSynchronizationProvider(db);
});

// Services
builder.Services.AddSingleton<IApiModuleManager, ApiModuleManager>();

builder.Services.AddSingleton<GraphQlModuleListener>();
builder.Services.AddSingleton<SignalRModuleListener>();
builder.Services.AddSingleton<IModuleListener>(sp => new ModuleListenerComposite(
                                                   sp.GetRequiredService<ILogger<ModuleListenerComposite>>()
                                                   , sp.GetRequiredService<GraphQlModuleListener>()
                                                   , sp.GetRequiredService<SignalRModuleListener>()
                                                   , sp.GetRequiredService<LegacyModuleListenerProxy>()));

#region Legacy
builder.Services.AddSingleton<LegacyModuleListenerProxy>();
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

#endregion Legacy

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
    b.AddJobAdvanced<AutomationRuleSyncJob>(TimeSpan.FromMinutes(1));
});

// Add GRPC auth client
builder.Services.AddGrpcClient<Grpc.AuthGrpc.AuthGrpcClient>(options =>
{
    options.Address = new Uri(Environment.GetEnvironmentVariable("AUTH_URL"));
});
builder.Services.AddScoped<IAuthGrpcValidator, AuthGrpcValidator>();

builder.Services.AddAuth(builder.Configuration.GetSection("JwtSettings"));

// -----
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<SensorHub>("/sockets/sensor");
app.MapHub<ActuatorHub>("/sockets/actuator");
app.MapHub<ModuleHub>("/sockets/module");

app.Run();