using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartGarden.Api.Core.Controller;
using SmartGarden.AuthService.Models;
using SmartGarden.EntityFramework.Auth.Models;

namespace SmartGarden.AuthService.Controller;

[Route("api/[controller]")]
[ApiController]
public class AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IOptions<JwtSettings> jwtSettingsOptions) : BaseController
{
    private JwtSettings jwtSettings = jwtSettingsOptions.Value;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginModel body)
    {
        if (string.IsNullOrEmpty(body.Username) || string.IsNullOrEmpty(body.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var user = new User { UserName = body.Username };

        var result = await userManager.CreateAsync(user, body.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        //await signInManager.SignInAsync(user, isPersistent: false);
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel body)
    {
        var user = await userManager.FindByNameAsync(body.Username);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, body.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid credentials.");
        }

        // --- Generate JWT upon successful login ---
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        // Add user roles to claims
        var userRoles = await userManager.GetRolesAsync(user);
        foreach (var role in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            expires: DateTime.Now.AddHours(1), // Token expiration
            claims: authClaims,
            signingCredentials: new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo
        });
    }
}