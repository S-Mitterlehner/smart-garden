using Microsoft.Extensions.Hosting;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var dbUsername = builder.AddParameter("username", secret: true, value: "postgres");
var dbPassword = builder.AddParameter("password", secret: true, value: "postgres");

var db = builder
    .AddPostgres("db", dbUsername, dbPassword)
    // .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(5050))
    .AddDatabase("smartgarden");

var api = builder.AddProject<SmartGarden_API>("api")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpEndpoint(5001, 8080, name: "httpapi")
    .WithHttpsEndpoint(5002, 8081, name: "httpsapi");

builder.AddNpmApp(
    "frontend",
    "../../frontend",
    "dev")
    .WaitFor(api)
    .WithReference(api)
    .WithHttpEndpoint(5173, 5173, name: "httpfrontend", isProxied: false);

builder.Build().Run();