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
    public class SystemRolesController : ControllerBase
    {
        private readonly IGenericRepository<SystemRole> _genericRepository;
        private readonly ApplicationDbContext _context;

        public SystemRolesController(IGenericRepository<SystemRole> genericRepository, ApplicationDbContext context)
        {
            _genericRepository = genericRepository;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemRoles()
        {
            var systemRole = await _genericRepository.GetAll();
            var result = systemRole.Select(sr => new 
            {
                Id = sr.Id,
                RoleName = sr.RoleName,
                IsActive = sr.IsActive,
                SystemName = _context.Systems.Where(s=>s.Id == sr.SystemId).Select(s=>s.SystemName).FirstOrDefault(),
                systemId= sr.SystemId
            }).OrderBy(sr => sr.systemId).ToList();
            return Ok(result);
        }

        [HttpGet]
        [Route("{userId:int}")]
        public async Task<IActionResult> GetSystemRoleByUserId([FromRoute] int userId)
        {
            var systemRole = await _context.SystemOwners
                .Where(x => x.UserId == userId)
                .GroupBy(x => new { x.UserId, x.Role })
                .Select(group => new
                {
                    UserId = group.Key.UserId,
                    Role = group.Key.Role,
                    SystemIds = group.Select(x => x.SystemId).ToList() // Collect system IDs into a list
                })
                .FirstOrDefaultAsync();

            if (systemRole == null)
            {
                return Ok(userId);
            }

            return Ok(systemRole);
        }

        [HttpPost]
        public async Task<IActionResult> AddSystemRole([FromBody] SystemRole role)
        {
            role.CreatedDate = DateTime.Now;
            var addedSystemRole = await _genericRepository.Add(role);
            return Ok(addedSystemRole);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSystemRole([FromBody] SystemRole role)
        {
            role.UpdatedDate = DateTime.Now;
            var updatedSystemRole = await _genericRepository.Update(role);
            return Ok(updatedSystemRole);
        }

    }
}   
