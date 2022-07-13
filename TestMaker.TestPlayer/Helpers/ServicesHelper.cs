using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using TestMaker.Common.Models;
using TestMaker.TestPlayer.Models.User;

namespace TestMaker.TestPlayer.Helpers
{
    public class ServicesHelper : IServicesHelper
    {
        private const string testPath = "api/Test/";
        private const string eventPath = "api/Event/";
        private const string getTokenPath = "connect/token";
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HttpClient _httpClient;

        public ServicesHelper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _httpClient = new HttpClient();
        }

        private string GetUrl(string url)
        {
            if (url.StartsWith(testPath))
            {
                return url.Replace(testPath, $"{_configuration["Sevices:Test"]}/api/");
            }
            if (url.StartsWith(eventPath))
            {
                return url.Replace(eventPath, $"{_configuration["Sevices:Event"]}/api/");
            }
            if (url == getTokenPath)
            {
                return $"{_configuration["Sevices:IdentityServer"]}/{getTokenPath}";
            }
            return url;
        }

        private string AccessToken
        {
            get
            {
                _httpContextAccessor.HttpContext.Request.Cookies.TryGetValue("accessToken", out string accessToken);

                return accessToken;
            }
        }

        public async Task<T?> GetAsync<T>(string url, Dictionary<string, object> parameters = null)
        {
            var requestUrl = GetUrl(url);
            if (parameters != null)
            {
                requestUrl = $"{GetUrl(url)}?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(requestUrl)
            };
            request.Headers.TryAddWithoutValidation("Authorization", $"Bearer {AccessToken}");

            var response = await _httpClient.SendAsync(request);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var responseContent = await response.Content.ReadAsStringAsync();

                var result = JsonConvert.DeserializeObject<ApiResult<T>>(responseContent);

                if (result.Code == 200 || result.Code == 404)
                {
                    return result.Data;
                }
                else
                {
                    throw new Exception(string.Join(",", result.Errors));
                }
            }
            throw new Exception("");
        }

        public async Task PostAsync(string url, Dictionary<string, object> parameters = null, object data = null)
        {
            HttpContent content = null;
            if (data != null)
            {
                content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            }

            var requestUrl = GetUrl(url);
            if (parameters != null)
            {
                requestUrl += $"?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(requestUrl),
                Content = content
            };
            request.Headers.TryAddWithoutValidation("Authorization", $"Bearer {AccessToken}");

            var response = await _httpClient.SendAsync(request);


            var responseContent = await response.Content.ReadAsStringAsync();

            var result = JsonConvert.DeserializeObject<ApiResult>(responseContent);

            if (result.Code != 200)
            {
                throw new Exception(string.Join(",", result.Errors));
            }
        }

        public async Task<T?> PostAsync<T>(string url, Dictionary<string, object> parameters = null, object data = null)
        {
            HttpContent content = null;
            if (data != null)
            {
                content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            }

            var requestUrl = GetUrl(url);
            if (parameters != null)
            {
                requestUrl += $"?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(requestUrl),
                Content = content
            };
            request.Headers.TryAddWithoutValidation("Authorization", $"Bearer {AccessToken}");

            var response = await _httpClient.SendAsync(request);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var responseContent = await response.Content.ReadAsStringAsync();

                var result = JsonConvert.DeserializeObject<ApiResult<T>>(responseContent);

                if (result.Code == 200)
                {
                    return result.Data;
                }
                else {
                    throw new Exception(string.Join(",", result.Errors));
                }
            }
            throw new Exception("");
        }

        public async Task<Token> GetTokenAsync(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                return null;
            }

            var baseUri = GetUrl(getTokenPath);

            var requestToken = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(baseUri),
                Content = new StringContent($"grant_type=password&username={userName}&password={password}")
            };

            requestToken.Content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded") { CharSet = "UTF-8" };
            requestToken.Headers.TryAddWithoutValidation("Authorization", "Basic dGVzdHBsYXllcjp0ZXN0cGxheWVy");

            var bearerResult = await _httpClient.SendAsync(requestToken);
            var bearerData = await bearerResult.Content.ReadAsStringAsync();
            var bearerToken = JsonConvert.DeserializeObject<Token>(bearerData);

            return bearerToken;
        }
    }
}
