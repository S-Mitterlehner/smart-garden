using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Automation;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Models;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.GraphQL;

public partial class Query
{
}