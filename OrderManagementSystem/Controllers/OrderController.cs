using Microsoft.AspNetCore.Mvc;

namespace OrderManagementSystem.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
