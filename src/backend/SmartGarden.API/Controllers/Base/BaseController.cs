using Microsoft.AspNetCore.Mvc;

namespace SmartGarden.API.Controllers.Base;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase;
