using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderManagementSystem.Data;
using OrderManagementSystem.Models;

namespace OrderManagementSystem.Services
{
    public class OrderItemsServices : IOrderItemsServices
    {
        private readonly ApplicationDbContext _context;
        public OrderItemsServices(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Create(OrderItemModel item)
        {
            _context.OrderItems.Add(item);
            await _context.SaveChangesAsync();
            return item.OrderItemId;
        }

        public async Task<int> Delete(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem != null)
            {
                _context.OrderItems.Remove(orderItem);
                await _context.SaveChangesAsync();

            }
            return orderItem.OrderItemId;
        }

        public async Task<OrderItemModel> GetOrderItemById(int id)
        {
            return await _context.OrderItems.FirstOrDefaultAsync(oi => oi.OrderItemId == id);
        }

        public async Task<List<OrderItemModel>> GetOrderItemsByOrderId(int OrderId)
        {
            return await _context.OrderItems.Where(oi => oi.OrderId == OrderId).ToListAsync();
        }

        public async Task<int> Update(OrderItemModel item)
        {
            _context.OrderItems.Update(item);
            await _context.SaveChangesAsync();
            return item.OrderItemId;
        }
    }
}
