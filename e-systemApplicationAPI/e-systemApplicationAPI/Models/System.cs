using System.ComponentModel.DataAnnotations;

namespace e_systemApplicationAPI.Models
{
    public class System
    {
        [Key]
        public int Id { get; set; }
        public string SystemName { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
