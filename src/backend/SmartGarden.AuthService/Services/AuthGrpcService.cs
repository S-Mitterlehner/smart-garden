using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartGarden.EntityFramework.Auth;
using SmartGarden.EntityFramework.Auth.Models;

namespace SmartGarden.AuthService.Services;
using Grpc.Core;

public class AuthGrpcService(UserManager<User> userManager, SignInManager<User> signInManager, AuthDbContext db) : AuthGrpc.AuthGrpcBase
{
    public override async Task<TokenValidationResult> ValidateToken(TokenRequest request, ServerCallContext context)
    {
        var usr = await signInManager.UserManager.FindByLoginAsync("password", request.Token);


        //var u = userManager.GetUserAsync()
        //var cp = signInManager.ValidateSecurityStampAsync();

        // Get ClaimsPrincipal from AspNetCore.Identity

        //var ut = await db.UserTokens.FirstOrDefaultAsync(x => x.Value == request.Token);
        //var user = await db.Users.FirstOrDefaultAsync(x => x.Id == ut.UserId);

        //var r = await signInManager.ValidateSecurityStampAsync(user, request.Token);

        return new TokenValidationResult
        {
            IsValid = true,
            UserId = ""
        };
    }
}