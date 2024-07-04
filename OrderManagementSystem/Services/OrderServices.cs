using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using OrderManagementSystem.Data;
using OrderManagementSystem.Models;
using OrderManagementSystem.Models.VM;

namespace OrderManagementSystem.Services
{
    public class OrderServices : IOrderServices
    {
        private readonly ApplicationDbContext _context;
        public OrderServices(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Create(OderItemVM model)
        {
            var masterData = new OrderModel()
            {
                OrderId = 0,
                CustomerName = model.CustomerName,
                Address = model.Address,
               Date = model.Date,
               TotalAmount = model.TotalAmount
            };
            var masterAdd = _context.Orders.Add(masterData);
            var masterAdd1 = await _context.SaveChangesAsync();

            if (masterAdd != null)
            {
                var details = from c in model.Items
                              select new OrderItemModel
                              {
                                  OrderId = masterAdd.Entity.OrderId,
                                  Price = c.Price,
                                  ProductName = c.ProductName,
                                  Quantity = c.Quantity,
                              };
                _context.OrderItems.AddRange(details);
                await _context.SaveChangesAsync();
            }
            return model.OrderId;
        }

        public async Task<int> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                var details = await _context.OrderItems.Where(u => u.OrderId == order.OrderId).ToListAsync();
                if(details.Count > 0)
                {
                    _context.OrderItems.RemoveRange(details);
                    _context.SaveChanges();
                }
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
            return order.OrderId;

        }

        public async Task<List<OderItemVM>> GetAll()
        {
            List<OderItemVM> result = new List<OderItemVM>();
            var masterData = _context.Orders.ToList();

            if (masterData.Count() > 0)
            {
                //result = (from c in masterData
                //          let detail = _context.OrderItems.Where(x => x.OrderId == c.OrderId).ToList()
                //          select new OderItemVM
                //          {
                //              CustomerName = c.CustomerName,
                //              OrderId = c.OrderId,
                //              Items = (from d in detail
                //                       select new ItemVM()
                //                       {
                //                          OrderItemId = d.OrderItemId,
                //                          Price = d.Price,
                //                          ProductName = d.ProductName,
                //                          Quantity = d.Quantity
                //                       }).ToList()
                //          }).ToList();

                foreach (var item in masterData)
                {

                    var detail = _context.OrderItems.Where(x => x.OrderId == item.OrderId).ToList();
                    var data = new OderItemVM()
                    {
                        OrderId = item.OrderId,
                        CustomerName = item.CustomerName,
                        Address = item.Address,
                        Date =item.Date,
                        TotalAmount = item.TotalAmount,
                    };
                    data.Items = (from d in detail
                                  select new ItemVM()
                                  {
                                      OrderItemId = d.OrderItemId,
                                      Price = d.Price,
                                      ProductName = d.ProductName,
                                      Quantity = d.Quantity
                                  }).ToList();
                    result.Add(data);
                }
            }

            return result;
        }

        public async Task<OderItemVM> GetById(int id)
        {
            var masterData = _context.Orders.Find(id);

            if (masterData == null)
            {
                return new OderItemVM();
            }
            else
            {
                var detail = _context.OrderItems.Where(x => x.OrderId == masterData.OrderId);
                var data = new OderItemVM()
                {
                    OrderId = masterData.OrderId,
                    CustomerName = masterData.CustomerName,
                };
                data.Items = (from d in detail
                              select new ItemVM()
                              {
                                  OrderItemId = d.OrderItemId,
                                  Price = d.Price,
                                  ProductName = d.ProductName,
                                  Quantity = d.Quantity
                              }).ToList();
                return data;
            }

        }

        public async Task<bool> Update(OderItemVM model)
        {
            var masterData = _context.Orders.Find(model.OrderId);
            if (masterData == null)
            {
                return false;
            }
            masterData.CustomerName = model.CustomerName;
            masterData.Address = model.Address;
            masterData.TotalAmount = model.TotalAmount;
            masterData.Date = model.Date;
            var masterAdd = _context.Orders.Update(masterData);
            await _context.SaveChangesAsync();


            var existingDetail = _context.OrderItems.Where(x => x.OrderId == masterData.OrderId);
            _context.OrderItems.RemoveRange(existingDetail);
            var details = from c in model.Items
                          select new OrderItemModel
                          {
                              OrderId = masterAdd.Entity.OrderId,
                              Price = c.Price,
                              ProductName = c.ProductName,
                              Quantity = c.Quantity,
                          };
            _context.OrderItems.AddRange(details);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
