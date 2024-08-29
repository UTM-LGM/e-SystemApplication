using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace e_systemApplicationAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public EmployeesController(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        [HttpGet]
        public async Task<IActionResult> GetEmployeeDivision ()
        {
            var connectionString = _configuration.GetConnectionString("eCutiConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    var command = new SqlCommand("SELECT * FROM division", connection); // Replace with your actual query
                    var reader = await command.ExecuteReaderAsync();

                    var result = new List<object>();

                    while (await reader.ReadAsync())
                    {
                        var row = new
                        {
                            // Assuming the table has columns named Id and DivisionName
                            Id = reader["div_id"],
                            DivisionName = reader["div_name"]
                        };
                        result.Add(row);
                    }

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    // Handle exception (log it and/or return an appropriate error response)
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployeeUnit()
        {
            var connectionString = _configuration.GetConnectionString("eCutiConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    var command = new SqlCommand("SELECT * FROM unit WHERE status = 1", connection); // Replace with your actual query
                    var reader = await command.ExecuteReaderAsync();

                    var result = new List<object>();

                    while (await reader.ReadAsync())
                    {
                        var row = new
                        {
                            // Assuming the table has columns named Id and DivisionName
                            Id = reader["unit_id"],
                            UnitName = reader["unit_name"],
                            DivisionId = reader["div_id"] 
                        };
                        result.Add(row);
                    }

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    // Handle exception (log it and/or return an appropriate error response)
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees()
        {
            var connectionString = _configuration.GetConnectionString("eCutiConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    var command = new SqlCommand("SELECT * FROM employee WHERE status = 1", connection); // Replace with your actual query
                    var reader = await command.ExecuteReaderAsync();

                    var result = new List<object>();

                    while (await reader.ReadAsync())
                    {
                        var row = new
                        {
                            // Assuming the table has columns named Id and DivisionName
                            Id = reader["emp_id"],
                            EmployeeName = reader["emp_name"],
                            UnitId = reader["unit_id"],
                            EmployeeEmail = reader["emp_email"]
                        };
                        result.Add(row);
                    }

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    // Handle exception (log it and/or return an appropriate error response)
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

    }
}
