using Projects;

var builder = DistributedApplication.CreateBuilder(args);

// db
var dbUsername = builder.AddParameter("username", secret: true, value: "postgres");
var dbPassword = builder.AddParameter("password", secret: true, value: "postgres");

var postgres = builder.AddPostgres("db", dbUsername, dbPassword);
var dbApi = postgres.AddDatabase("smartgarden-api");
var dbConnectionService = postgres.AddDatabase("smartgarden-connection-service");
var dbAutomationService = postgres.AddDatabase("smartgarden-automation-service");

// redis

var redis = builder.AddRedis("redis-api");

// rabbitmq

var rabbitMqUsername = builder.AddParameter("username-rabbit", secret: true, value: "rabbitmq");
var rabbitMqPassword = builder.AddParameter("password-rabbit", secret: true, value: "rabbitmq");

var rabbitmq = builder
    .AddRabbitMQ("rabbitmq", rabbitMqUsername, rabbitMqPassword)
    .WithManagementPlugin(port: 15672)
    .WithExternalHttpEndpoints();

// applications

var frontend = builder.AddNpmApp(
        "frontend",
        "../../frontend",
        "dev")
    .WithExplicitStart()
    .WithHttpEndpoint(5173, 5173, name: "httpfrontend", isProxied: false)
    .WithExternalHttpEndpoints();

builder.AddProject<SmartGarden_API>("api")
    .WithReference(dbApi)
    .WithReference(rabbitmq)
    .WithReference(frontend)
    .WithReference(redis)
    .WaitFor(dbApi)
    .WaitFor(rabbitmq)
    .WaitFor(redis)
    .WithHttpEndpoint(5001, 8080, name: "httpapi")
    .WithHttpsEndpoint(5002, 8081, name: "httpsapi")
    .WithExternalHttpEndpoints();

builder.AddProject<SmartGarden_ConnectorService>("connector-service")
    .WithReference(rabbitmq)
    .WithReference(dbConnectionService)
    .WaitFor(rabbitmq)
    .WaitFor(dbConnectionService);

builder.AddProject<SmartGarden_AutomationService>("automation-service")
    .WithReference(rabbitmq)
    .WithReference(dbAutomationService)
    .WaitFor(rabbitmq)
    .WaitFor(dbAutomationService);

builder.Build().Run();