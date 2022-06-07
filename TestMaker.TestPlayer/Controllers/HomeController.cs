using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace TM.TestPlayer.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
        }

        public IActionResult Index()
        {
            Response.Cookies.Delete("EventCode");
            Response.Cookies.Delete("CandidateCode");

            return View();
        }
    }
}
