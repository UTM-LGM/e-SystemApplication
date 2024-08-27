using e_systemApplicationAPI.Data;
using e_systemApplicationAPI.IRepository;
using e_systemApplicationAPI.Models;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using e_systemApplicationAPI.Repository;

namespace e_systemApplicationAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IGenericRepository<Application> _genericRepository;
        private readonly ApplicationDbContext _context;
        private readonly EmailRepository _emailRepository;


        public ApplicationsController(IGenericRepository<Application> genericRepository, ApplicationDbContext context, EmailRepository emailRepository)
        {
            _genericRepository = genericRepository;
            _context = context;
            _emailRepository = emailRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddApplication([FromBody] Application application)
        {
            application.CreatedDate = DateTime.Now;
            var addedApplication = await _genericRepository.Add(application);
            return Ok(addedApplication);
        }

        [HttpGet]
        public async Task<IActionResult> GetApplication()
        {
            var applications = await _genericRepository.GetAll();
            return Ok(applications);
        }

        [HttpPut]
        public async Task<IActionResult> ApprovedApplication([FromBody] Application[] applications )
        {
            foreach(var item in applications)
            {
                var existingApplication = await _context.Applications.FirstOrDefaultAsync(x=>x.Id == item.Id);
                if(existingApplication != null)
                {
                    existingApplication.ApprovalId = item.ApprovalId;
                    existingApplication.ApprovalDate = DateTime.Now;
                    existingApplication.Status = item.Status;
                    await _context.SaveChangesAsync();
                }
            }
            return Ok(applications);
        }

        [HttpPut]
        public async Task<IActionResult> AssignedApplication([FromBody] Application[] applications)
        {
            foreach (var item in applications)
            {
                var existingApplication = await _context.Applications.FirstOrDefaultAsync(x => x.Id == item.Id);
                if (existingApplication != null)
                {
                    existingApplication.AssignedBy = item.AssignedBy;
                    existingApplication.AssignedDate = DateTime.Now;
                    existingApplication.Status = item.Status;
                    await _context.SaveChangesAsync();
                    await _emailRepository.sendWelcomeEmail(existingApplication);
                }
            }
            return Ok(applications);
        }

       
    }
}
