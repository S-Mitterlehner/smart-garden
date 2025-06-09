using Microsoft.AspNetCore.Mvc;
using SmartGarden.AuthService.Models;
using SmartGarden.AuthService.Services;

namespace SmartGarden.AuthService.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await authService.RegisterAsync(request);
        if (!result.Success) return BadRequest();
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var token = await authService.LoginAsync(request);
        return token is null ? Unauthorized() : Ok(new { token });
    }
}
