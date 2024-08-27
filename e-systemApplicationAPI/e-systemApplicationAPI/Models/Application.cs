using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_systemApplicationAPI.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string DivId { get; set; }
        public string UnitId { get; set; }
        public string UserEmail { get; set; }

        [ForeignKey("SystemId")]
        public int SystemId { get; set; }
        public System? System { get; set; }

        [ForeignKey("SystemRoleId")]
        public int SystemRoleId { get; set; }
        public SystemRole? SystemRole { get; set; }

        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }   
        public int? ApprovalId { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string Status { get; set; }
        public int? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
    }
}
