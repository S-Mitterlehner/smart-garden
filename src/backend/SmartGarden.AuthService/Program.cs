using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartGarden.AuthService.Services;
using SmartGarden.EntityFramework.Auth;
using SmartGarden.EntityFramework.Auth.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddControllers();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenValidator, TokenValidator>();

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AuthDbContext>(o => o.UseInMemoryDatabase("blablablubb"));

builder.Services.AddIdentityCore<User>();
builder.Services.AddIdentityApiEndpoints<User>(o =>
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
app.UseSwagger();
app.UseSwaggerUI();

app.MapSwagger();

app.MapGrpcService<AuthGrpcService>();
app.MapIdentityApi<User>();

app.Run();