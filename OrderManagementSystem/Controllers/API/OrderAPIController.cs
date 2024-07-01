using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderManagementSystem.Models;
using OrderManagementSystem.Models.VM;
using OrderManagementSystem.Services;

namespace OrderManagementSystem.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderAPIController : ControllerBase
    {
        private readonly IOrderServices _orderServices;
        
        public OrderAPIController(IOrderServices orderServices)
        {
            
            _orderServices = orderServices;
        }
        [HttpGet]
        public async Task<List<OderItemVM>> GetOrders()
        {
           return await _orderServices.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OderItemVM>> GetOrder(int id)
        {
            var order = await _orderServices.GetById(id);
            if(order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }
        [HttpPost]
        public async Task<ActionResult<int>> Create(OderItemVM order)
        {
           return await _orderServices.Create(order);

        }

        [HttpPut]
        public async Task<ActionResult<bool>> Update(OderItemVM order)
        {
            return await _orderServices.Update(order);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> Delete(int id)
        {
            return await _orderServices.Delete(id);
        }


    }
}
