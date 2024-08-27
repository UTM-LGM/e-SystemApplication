using e_systemApplicationAPI.Data;
using e_systemApplicationAPI.IRepository;
using e_systemApplicationAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace e_systemApplicationAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SystemOwnersController : ControllerBase
    {
        private readonly IGenericRepository<SystemOwner> _genericRepository;

        public SystemOwnersController(IGenericRepository<SystemOwner> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemOwners()
        {
            var systemOwners = await _genericRepository.GetAll();
            return Ok(systemOwners);
        }


        [HttpPost]
        public async Task<IActionResult> AddSystemOwner ([FromBody] SystemOwner owner)
        {
            owner.CreatedDate = DateTime.Now;
            var addedSystemOwner = await _genericRepository.Add(owner);
            return Ok(addedSystemOwner);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSystemOwner ([FromBody] SystemOwner owner)
        {
            owner.UpdatedDate = DateTime.Now;
            var updatedSystemOwner = await _genericRepository.Update(owner);
            return Ok(updatedSystemOwner);
        }

    }
}
