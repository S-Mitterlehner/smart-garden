using Microsoft.AspNetCore.Mvc;

namespace SmartGarden.Api.Beds.Controllers.Base;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase;
