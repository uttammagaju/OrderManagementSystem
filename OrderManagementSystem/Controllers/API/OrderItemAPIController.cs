using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderManagementSystem.Models;
using OrderManagementSystem.Services;

namespace OrderManagementSystem.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemAPIController : ControllerBase
    {
        private readonly IOrderItemsServices _orderItemsServices;
        public OrderItemAPIController(IOrderItemsServices orderItemsServices)
        {
            _orderItemsServices = orderItemsServices;
        }
        [HttpGet("byOrder/{orderId}")]
        public async Task<ActionResult<List<OrderItemModel>>> GetOrderItemsByOrderId(int orderId)
        {
            return await _orderItemsServices.GetOrderItemsByOrderId(orderId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemModel>> GetOrderItem(int id)
        {
            return await _orderItemsServices.GetOrderItemById(id);
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(OrderItemModel orderItem)
        {
            await _orderItemsServices.Create(orderItem);
            return CreatedAtAction(nameof(GetOrderItem), new { id = orderItem.OrderItemId }, orderItem);
        }

        [HttpPut]
        public async Task<ActionResult<int>> Update(OrderItemModel order)
        {
            return await _orderItemsServices.Update(order);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> Delete(int id)
        {
            return await _orderItemsServices.Delete(id);
        }
    }
}
