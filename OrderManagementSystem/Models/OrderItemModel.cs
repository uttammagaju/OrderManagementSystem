using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OrderManagementSystem.Models
{
    public class OrderItemModel
    {
        [Key]
        public int OrderItemId { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Price { get; set; } = decimal.Zero;
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        [JsonIgnore]
        public OrderModel Order { get; set; }
    }
}
