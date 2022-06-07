using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Helpers
{
    public class ServicesHelper : IServicesHelper
    {
        private const string testPath = "api/Test/";
        private const string eventPath = "api/Event/";
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ServicesHelper(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        private string GetUrl(string url)
        {
            if (url.StartsWith(testPath))
            {
                return url.Replace(testPath, _configuration["Sevices:Test"]);
            }
            if (url.StartsWith(eventPath))
            {
                return url.Replace(eventPath, _configuration["Sevices:Event"]);
            }
            return url;
        }

        public async Task<T> GetAsync<T>(string url, Dictionary<string, object> parameters = null)
        {
            var requestUrl = GetUrl(url);
            if (parameters != null)
            {
                requestUrl = $"{GetUrl(url)}?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }
            var response = await _httpClient.GetAsync(requestUrl);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var result = await response.Content.ReadAsStringAsync();

                if (typeof(T) == typeof(string))
                {
                    return (T)Convert.ChangeType(result, typeof(T));
                }

                return JsonConvert.DeserializeObject<T>(result);
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

            var requestUrlAsParams = GetUrl(url);
            if (parameters != null)
            {
                requestUrlAsParams += $"?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }

            var response = await _httpClient.PostAsync(requestUrlAsParams, content);
        }

        public async Task<T> PostAsync<T>(string url, Dictionary<string, object> parameters = null, object data = null)
        {
            HttpContent content = null;
            if (data != null)
            {
                content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            }

            var requestUrlAsParams = GetUrl(url);
            if (parameters != null)
            {
                requestUrlAsParams += $"?{string.Join("&", parameters.Select(x => $"{x.Key}={x.Value}"))}";
            }

            var response = await _httpClient.PostAsync(requestUrlAsParams, content);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var result = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<T>(result);
            }
            throw new Exception("");
        }
    }
}
