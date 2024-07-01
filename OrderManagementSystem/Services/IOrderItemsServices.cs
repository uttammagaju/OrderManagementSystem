using OrderManagementSystem.Models;

namespace OrderManagementSystem.Services
{
    public interface IOrderItemsServices
    {
        Task<List<OrderItemModel>> GetOrderItemsByOrderId(int OrderId);
        Task<OrderItemModel> GetOrderItemById(int id);
        Task<int> Create(OrderItemModel item);
        Task<int> Update(OrderItemModel item);
        Task<int> Delete(int id);
    }
}
