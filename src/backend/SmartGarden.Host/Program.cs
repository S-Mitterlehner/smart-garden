using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var dbUsername = builder.AddParameter("username", secret: true, value: "postgres");
var dbPassword = builder.AddParameter("password", secret: true, value: "postgres");

var db = builder
    .AddPostgres("db", dbUsername, dbPassword)
    // .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(5050))
    .AddDatabase("smartgarden");

var rabbitMqUsername = builder.AddParameter("usernameRabbit", secret: true, value: "rabbitmq");
var rabbitMqPassword = builder.AddParameter("passwordRabbit", secret: true, value: "rabbitmq");

var rabbitmq = builder
    .AddRabbitMQ("messaging", rabbitMqUsername, rabbitMqPassword)
    .WithManagementPlugin()
    .WithExternalHttpEndpoints();

var frontend = builder.AddNpmApp(
        "frontend",
        "../../frontend",
        "dev")
    .WithHttpEndpoint(5173, 5173, name: "httpfrontend", isProxied: false)
    .WithExternalHttpEndpoints();

var api = builder.AddProject<SmartGarden_API>("api")
    .WithReference(db)
    .WithReference(rabbitmq)
    .WithReference(frontend)
    .WaitFor(db)
    .WaitFor(rabbitmq)
    .WithHttpEndpoint(5001, 8080, name: "httpapi")
    .WithHttpsEndpoint(5002, 8081, name: "httpsapi")
    .WithExternalHttpEndpoints();

var executor = builder.AddProject<SmartGarden_ExecutorService>("executor")
    .WithReference(rabbitmq)
    .WithReference(db)
    .WaitFor(rabbitmq);

builder.Build().Run();