using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace e_systemApplicationAPI.Models
{
    public class SystemOwner
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string DivId { get; set; }
        public string UnitId { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

        [ForeignKey("SystemId")]
        public int SystemId { get; set; }
        public System? System { get; set; }
    }
}
