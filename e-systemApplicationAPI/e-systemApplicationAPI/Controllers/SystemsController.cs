using e_systemApplicationAPI.IRepository;
using e_systemApplicationAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace e_systemApplicationAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SystemsController : ControllerBase
    {
        private readonly IGenericRepository<e_systemApplicationAPI.Models.System> _genericRepository;

        public SystemsController(IGenericRepository<e_systemApplicationAPI.Models.System> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetSystems()
        {
            var systems = await _genericRepository.GetAll();
            return Ok(systems);
        }

        [HttpPost]
        public async Task<IActionResult> AddSystem([FromBody] e_systemApplicationAPI.Models.System system)
        {
            system.CreatedDate = DateTime.Now;
            var addedSystem = await _genericRepository.Add(system);
            return Ok(addedSystem);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSystem([FromBody] e_systemApplicationAPI.Models.System system)
        {
            system.UpdatedDate = DateTime.Now;
            var updatedSystem = await _genericRepository.Update(system);
            return Ok(updatedSystem);
        }
    }
}
