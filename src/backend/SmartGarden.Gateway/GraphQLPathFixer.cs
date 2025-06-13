namespace SmartGarden.Gateway;

public class GraphQLPathFixer : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.Request.Path.Value is not null && context.Request.Path.Value.ToLower().EndsWith("/graphql"))
        {
            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status301MovedPermanently;
            context.Response.Headers.Location = context.Request.Path.Value + "/";
            return;
        }

        await next(context);
    }
}