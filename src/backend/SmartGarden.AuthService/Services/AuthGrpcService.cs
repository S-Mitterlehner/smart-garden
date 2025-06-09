namespace SmartGarden.AuthService.Services;
using Grpc.Core;

public class AuthGrpcService(ITokenValidator tokenValidator) : AuthGrpc.AuthGrpcBase
{
    public override Task<TokenValidationResult> ValidateToken(TokenRequest request, ServerCallContext context)
    {
        var result = tokenValidator.Validate(request.Token);
        return Task.FromResult(new TokenValidationResult
        {
            IsValid = result.IsValid,
            UserId = result.UserId ?? ""
        });
    }
}