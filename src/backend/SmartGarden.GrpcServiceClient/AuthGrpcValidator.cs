using Grpc;
using Grpc.Net.Client;
using Microsoft.Extensions.Logging;

namespace GrpcServiceClient;

public class AuthGrpcValidator(AuthGrpc.AuthGrpcClient client, ILogger<AuthGrpcValidator> logger) : IAuthGrpcValidator
{
    public async Task<(bool, string?)> ValidateTokenAsync(string token)
    {
        // The port number must match the port of the gRPC server.
        // using var channel = GrpcChannel.ForAddress("http://localhost:5036");
        // var authClient = new Grpc.AuthGrpc.AuthGrpcClient(channel);
        var r = await client.ValidateTokenAsync(new Grpc.TokenRequest { Token = token });
        logger.LogInformation("Auth: {RUserId} isValid: {RIsValid}", r.UserId, r.IsValid);
        return (r.IsValid, r.UserId);
    }
}