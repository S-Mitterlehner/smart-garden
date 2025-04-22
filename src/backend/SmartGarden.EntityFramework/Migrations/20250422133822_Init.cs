using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartGarden.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Actuator",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actuator", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Plant",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plant", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sensor",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Min = table.Column<double>(type: "double precision", nullable: false),
                    Max = table.Column<double>(type: "double precision", nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ActuatorAction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<int>(type: "integer", nullable: false),
                    ActuatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActuatorAction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActuatorAction_Actuator_ActuatorId",
                        column: x => x.ActuatorId,
                        principalTable: "Actuator",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Bed",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PlantId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bed_Plant_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlantSensorConfig",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SensorType = table.Column<int>(type: "integer", nullable: false),
                    RangeFrom = table.Column<double>(type: "double precision", nullable: false),
                    RangeTo = table.Column<double>(type: "double precision", nullable: false),
                    PlantId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantSensorConfig", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlantSensorConfig_Plant_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plant",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BedActuator",
                columns: table => new
                {
                    BedId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActuatorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BedActuator", x => new { x.BedId, x.ActuatorId });
                    table.ForeignKey(
                        name: "FK_BedActuator_Actuator_ActuatorId",
                        column: x => x.ActuatorId,
                        principalTable: "Actuator",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BedActuator_Bed_BedId",
                        column: x => x.BedId,
                        principalTable: "Bed",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BedSensor",
                columns: table => new
                {
                    BedId = table.Column<Guid>(type: "uuid", nullable: false),
                    SensorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BedSensor", x => new { x.BedId, x.SensorId });
                    table.ForeignKey(
                        name: "FK_BedSensor_Bed_BedId",
                        column: x => x.BedId,
                        principalTable: "Bed",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BedSensor_Sensor_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActuatorAction_ActuatorId",
                table: "ActuatorAction",
                column: "ActuatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Bed_PlantId",
                table: "Bed",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_BedActuator_ActuatorId",
                table: "BedActuator",
                column: "ActuatorId");

            migrationBuilder.CreateIndex(
                name: "IX_BedSensor_SensorId",
                table: "BedSensor",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantSensorConfig_PlantId",
                table: "PlantSensorConfig",
                column: "PlantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActuatorAction");

            migrationBuilder.DropTable(
                name: "BedActuator");

            migrationBuilder.DropTable(
                name: "BedSensor");

            migrationBuilder.DropTable(
                name: "PlantSensorConfig");

            migrationBuilder.DropTable(
                name: "Actuator");

            migrationBuilder.DropTable(
                name: "Bed");

            migrationBuilder.DropTable(
                name: "Sensor");

            migrationBuilder.DropTable(
                name: "Plant");
        }
    }
}
