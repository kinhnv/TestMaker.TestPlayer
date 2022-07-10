﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TestMaker.TestPlayer.Helpers;
using TestMaker.TestPlayer.Models.User;

namespace TestMaker.TestPlayer.Controllers
{
    public class LoginController : Controller
    {
        private readonly IServicesHelper _servicesHelper;

        public LoginController(IServicesHelper servicesHelper)
        {
            _servicesHelper = servicesHelper;
        }

        public IActionResult Index()
        {
            return View(new LoginRequest());
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromForm]LoginRequest request)
        {
            var token = await _servicesHelper.GetTokenAsync(request.UserName, request.Password);
            if (token == null)
            {
                return Ok(null);
            }

            return Ok(token);
        }
    }
}
