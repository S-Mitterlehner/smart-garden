using Projects;

var builder = DistributedApplication.CreateBuilder(args);

// db
var dbUsername = builder.AddParameter("username", secret: true, value: "postgres");
var dbPassword = builder.AddParameter("password", secret: true, value: "postgres");

var postgres = builder.AddPostgres("db", dbUsername, dbPassword);
var dbBedApi = postgres.AddDatabase("bed-db");
var dbPlantApi = postgres.AddDatabase("plant-db");
var dbConnectionService = postgres.AddDatabase("connection-service-db");
var dbAutomationService = postgres.AddDatabase("automation-service-db");

// redis
var redis = builder.AddRedis("redis-api");

// rabbitmq
var rabbitMqUsername = builder.AddParameter("username-rabbit", secret: true, value: "rabbitmq");
var rabbitMqPassword = builder.AddParameter("password-rabbit", secret: true, value: "rabbitmq");

var rabbitmq = builder
    .AddRabbitMQ("rabbitmq", rabbitMqUsername, rabbitMqPassword)
    .WithManagementPlugin(port: 15672)
    .WithExternalHttpEndpoints();

// Applications
var frontend = builder.AddNpmApp(
        "frontend",
        "../../frontend",
        "dev")
    .WithExplicitStart()
    .WithHttpEndpoint(5173, 5173, name: "httpfrontend", isProxied: false)
    .WithExternalHttpEndpoints();

// apis
var bedApi = builder.AddProject<SmartGarden_Api_Beds>("bed-api")
    .WithReference(dbBedApi)
    .WithReference(rabbitmq)
    .WithReference(redis)
    .WaitFor(dbBedApi)
    .WaitFor(rabbitmq)
    .WaitFor(redis)
    //.WithHttpEndpoint(5001, 8080, name: "httpapi")
    //.WithHttpsEndpoint(5002, 8081, name: "httpsapi")
    .WithExternalHttpEndpoints();
    //.WithReplicas(2);

var plantApi = builder.AddProject<SmartGarden_Api_Plants>("plant-api")
    .WithReference(dbPlantApi)
    .WaitFor(dbPlantApi)
    //.WithHttpEndpoint(5003, 8080, name: "httpapi")
    //.WithHttpsEndpoint(5004, 8081, name: "httpsapi")
    .WithExternalHttpEndpoints();

// services
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

// gateway
// builder.AddYarp("gateway")
//     .WithConfigFile("yarp.json")
//     .WithReference(bedApi)
//     .WithReference(plantApi)
//     .WithHttpEndpoint(5000, 5000, name: "httpgateway")
//     //.WithHttpsEndpoint(5010, 5000, name: "httpsgateway")
//     .WithExternalHttpEndpoints();

//builder.AddDockerfile("nginx", "./infrastructure/nginx", "Dockerfile.nginx")
//    .WithReference(bedApi)
//    .WithReference(plantApi)
//    .WithExternalHttpEndpoints()
//    .WithHttpEndpoint(name: "nginx-http", port: 8080, targetPort: 8080)
//    .WithHttpsEndpoint(name: "nginx-https", port: 8081, targetPort: 8081);

builder.AddProject<SmartGarden_Gateway>("gateway")
       .WithReference(plantApi)
       .WithReference(bedApi)
       .WithReference(frontend)
       .WaitFor(bedApi)
       .WaitFor(plantApi)
       //.WithHttpEndpoint(5000, 5000, name: "httpgateway")
       .WithExternalHttpEndpoints();

builder.Build().Run();