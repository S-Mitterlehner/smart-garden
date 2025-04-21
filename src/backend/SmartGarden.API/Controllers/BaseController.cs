using Microsoft.AspNetCore.Mvc;

namespace SmartGarden.API.Controllers;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase;
