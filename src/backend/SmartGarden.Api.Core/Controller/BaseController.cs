using Microsoft.AspNetCore.Mvc;

namespace SmartGarden.Api.Core.Controller;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase;
