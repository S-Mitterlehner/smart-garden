using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartGarden.AuthService.Services;
using SmartGarden.EntityFramework.Auth;
using SmartGarden.EntityFramework.Auth.Models;
using Serilog;
using SmartGarden.AuthService.Models;

Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Debug()
             .Enrich.FromLogContext()
             .WriteTo.Console()
             .WriteTo.OpenTelemetry()
             .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddAuthorization();
builder.Services.AddCors();

builder.Services.AddDbContext<AuthDbContext>(o => o.UseInMemoryDatabase("blablablubb"));

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

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(o => o.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseSwagger();
app.UseSwaggerUI();

app.MapSwagger();
app.MapControllers();
//app.MapIdentityApi<User>();

app.Run();