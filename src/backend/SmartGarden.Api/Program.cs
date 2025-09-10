using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartGarden.Messaging;
using SmartGarden.Messaging.Messages;
using SmartGarden.Modules;
using SmartGarden.Modules.Api;
using SmartGarden.Scheduling;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Identity;
using SmartGarden.Api;
using SmartGarden.Api.GraphQL;
using SmartGarden.Api.Hubs;
using SmartGarden.Api.Jobs;
using SmartGarden.Api.Listener;
using SmartGarden.Api.Listener.Legacy;
using SmartGarden.Api.Models;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.EntityFramework.Seeding;
using SmartGarden.Legacy;
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
builder.AddNpgsqlDbContext<ApplicationDbContext>("api-db"
    , s => {}
    , b => b.UseLazyLoadingProxies()
    );
builder.Services.AddDbContext<AuthDbContext>(o => o.UseInMemoryDatabase("AuthDb"));
builder.Services.AddDistributedDbInitializerWithJsonSeeder<ApiSeedModel, ApplicationDbContext>("../Seeds/dev.seed.json");

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
    .AddInMemorySubscriptions()
    .AddApolloFederation();

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

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddAuth(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddCors();

builder.Services.AddIdentity<User, IdentityRole>(o =>
    {
        o.Password.RequireDigit = false;
        o.Password.RequireLowercase = false;
        o.Password.RequireUppercase = false;
        o.Password.RequireNonAlphanumeric = false;
        o.Password.RequiredLength = 6;
        o.Password.RequiredUniqueChars = 1;
        o.SignIn.RequireConfirmedAccount = false;
        o.SignIn.RequireConfirmedEmail = false;
        o.SignIn.RequireConfirmedPhoneNumber = false;
        o.User.RequireUniqueEmail = false;
        o.Tokens.AuthenticatorIssuer = "me";
    })
    .AddEntityFrameworkStores<AuthDbContext>();

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