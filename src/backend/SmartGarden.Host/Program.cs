using Projects;

var builder = DistributedApplication.CreateBuilder(args);

// db
var dbUsername = builder.AddParameter("username", secret: true, value: "postgres");
var dbPassword = builder.AddParameter("password", secret: true, value: "postgres");

var postgres = builder.AddPostgres("db", dbUsername, dbPassword);
var dbApi = postgres.AddDatabase("smartgarden");
var dbConnectionService = postgres.AddDatabase("smartgarden-connection-service");

// redis
var redis = builder.AddRedis("state-cache");

// rabbitmq

var rabbitMqUsername = builder.AddParameter("usernameRabbit", secret: true, value: "rabbitmq");
var rabbitMqPassword = builder.AddParameter("passwordRabbit", secret: true, value: "rabbitmq");

var rabbitmq = builder
    .AddRabbitMQ("messaging", rabbitMqUsername, rabbitMqPassword)
    .WithManagementPlugin()
    .WithExternalHttpEndpoints();


// applications

var frontend = builder.AddNpmApp(
        "frontend",
        "../../frontend",
        "dev")
    .WithHttpEndpoint(5173, 5173, name: "httpfrontend", isProxied: false)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

var api = builder.AddProject<SmartGarden_API>("api")
    .WithReference(dbApi)
    .WithReference(rabbitmq)
    .WithReference(frontend)
    .WithReference(redis)
    .WaitFor(dbApi)
    .WaitFor(rabbitmq)
    .WaitFor(redis)
    .WithHttpEndpoint(5001, 8080, name: "httpapi")
    .WithHttpsEndpoint(5002, 8081, name: "httpsapi")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

var executor = builder.AddProject<SmartGarden_ExecutorService>("executor")
    .WithReference(rabbitmq)
    .WithReference(dbConnectionService)
    .WaitFor(rabbitmq)
    .PublishAsDockerFile();

builder.Build().Run();