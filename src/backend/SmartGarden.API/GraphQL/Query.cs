using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGarden.API.Dtos;
using SmartGarden.API.Dtos.Actuator;
using SmartGarden.API.Dtos.Sensor;
using SmartGarden.EntityFramework;
using SmartGarden.EntityFramework.Models;
using SmartGarden.Modules.Actuators;
using SmartGarden.Modules.Sensors;

namespace SmartGarden.API.GraphQL;

// https://localhost:5002/graphql/
// https://chillicream.com/docs/hotchocolate/v15/defining-a-schema/queries
// https://chillicream.com/docs/hotchocolate/v11/integrations/entity-framework

public partial class Query
{
}