using System.ComponentModel.DataAnnotations;

namespace OrderManagementSystem.Models.VM
{
    public class OderItemVM
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string Date {  get; set; }
        public decimal TotalAmount { get; set; }
        public List<ItemVM> Items { get; set; }
    }

    public class ItemVM
    {
        public int OrderItemId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } = decimal.Zero;
    }
}
