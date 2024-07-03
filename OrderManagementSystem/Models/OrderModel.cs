using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OrderManagementSystem.Models
{
    public class OrderModel
    {
        [Key]
        public int OrderId { get; set; }
        [Required]
        public string CustomerName { get; set; }
        [Required]
        public string Address { get; set; }
        
        public DateTime Date { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }

    }
}
