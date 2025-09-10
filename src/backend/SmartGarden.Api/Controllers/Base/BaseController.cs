using Microsoft.AspNetCore.Mvc;

namespace SmartGarden.Api.Controllers.Base;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase;
