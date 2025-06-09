namespace GrpcServiceClient;

public interface IAuthGrpcValidator
{
    Task<(bool IsValid, string? UserId)> ValidateTokenAsync(string token);
}