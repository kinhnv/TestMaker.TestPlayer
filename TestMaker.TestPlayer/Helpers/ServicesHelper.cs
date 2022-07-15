using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
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
        private const string userPath = "api/User/";
        private const string getTokenPath = "connect/token";
        private const string ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
        private const string REFRESH_TOKEN_KEY = "REFRESH_TOKEN";
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;

        public ServicesHelper(
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IMemoryCache memoryCache)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
            _memoryCache = memoryCache;
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
            if (url.StartsWith(userPath))
            {
                return url.Replace(userPath, $"{_configuration["Sevices:User"]}/api/");
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
                
                var check = _memoryCache.TryGetValue(ACCESS_TOKEN_KEY, out string accessToken);

                if (check)
                {
                    return accessToken;
                }
                else
                {
                    if (string.IsNullOrEmpty(RefreshToken))
                    {
                        return null;
                    }

                    var baseUri = GetUrl(getTokenPath);

                    var requestToken = new HttpRequestMessage
                    {
                        Method = HttpMethod.Post,
                        RequestUri = new Uri(baseUri),
                        Content = new StringContent($"grant_type=refresh_token&refresh_token={RefreshToken}")
                    };

                    requestToken.Content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded") { CharSet = "UTF-8" };
                    requestToken.Headers.TryAddWithoutValidation("Authorization", "Basic dGVzdC1wbGF5ZXI6dGVzdC1wbGF5ZXI=");

                    var bearerResult = _httpClient.Send(requestToken);
                    var bearerAsJson = bearerResult.Content.ReadAsStringAsync().Result;
                    var token = JsonConvert.DeserializeObject<Token>(bearerAsJson);

                    if (token.AccessToken != null)
                        _memoryCache.Set(ACCESS_TOKEN_KEY, token.AccessToken, new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(1)));

                    if (token.RefreshToken != null)
                        _memoryCache.Set(REFRESH_TOKEN_KEY, token.RefreshToken, new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromDays(15)));

                    return token.RefreshToken;
                }
            }
        }

        private string RefreshToken
        {
            get
            {
                var check = _memoryCache.TryGetValue(REFRESH_TOKEN_KEY, out string refreshToken);

                if (check)
                {
                    return refreshToken;
                }
                else
                {
                    return null;
                }
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
            requestToken.Headers.TryAddWithoutValidation("Authorization", "Basic dGVzdC1wbGF5ZXI6dGVzdC1wbGF5ZXI=");

            var bearerResult = await _httpClient.SendAsync(requestToken);
            var bearerData = await bearerResult.Content.ReadAsStringAsync();
            var token = JsonConvert.DeserializeObject<Token>(bearerData);

            if (token.AccessToken != null)
            {
                _memoryCache.Set(ACCESS_TOKEN_KEY, token.AccessToken, TimeSpan.FromHours(1));
            }

            if (token.RefreshToken != null)
                _memoryCache.Set(REFRESH_TOKEN_KEY, token.RefreshToken, TimeSpan.FromDays(15));

            return token.AccessToken != null ? token : null;
        }
    }
}
