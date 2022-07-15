using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using TestMaker.TestPlayer.Helpers;
using TestMaker.TestPlayer.Models.User;

namespace TestMaker.TestPlayer.Controllers
{
    public class HomeController : Controller
    {
        private readonly IServicesHelper _servicesHelper;

        public HomeController(IServicesHelper servicesHelper)
        {
            _servicesHelper = servicesHelper;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.FirstName = string.Empty;

            if (_servicesHelper.AccessToken != null)
            {
                var user = await _servicesHelper.GetAsync<User>("api/User/Profile");

                if (user != null)
                {
                    ViewBag.FirstName = user.FirstName;
                }
            }

            Response.Cookies.Delete("EventCode");
            Response.Cookies.Delete("CandidateCode");

            return View();
        }
    }
}
