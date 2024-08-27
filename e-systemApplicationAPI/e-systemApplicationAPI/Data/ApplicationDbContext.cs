using e_systemApplicationAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace e_systemApplicationAPI.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<e_systemApplicationAPI.Models.System> Systems { get; set; }
        public DbSet<SystemRole> SystemRoles { get; set; }
        public DbSet<SystemOwner> SystemOwners { get; set; }
        public DbSet<Application> Applications { get; set; }
    }
}
