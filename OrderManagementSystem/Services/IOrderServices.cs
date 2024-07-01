using OrderManagementSystem.Models;
using OrderManagementSystem.Models.VM;

namespace OrderManagementSystem.Services
{
    public interface IOrderServices
    {
        //retrive all OrderModel data
       Task<List<OderItemVM>> GetAll();
        Task<OderItemVM> GetById(int id);
        Task<int> Create(OderItemVM model);
        Task<bool> Update(OderItemVM model);
        Task<int> Delete(int id);
    }
}
