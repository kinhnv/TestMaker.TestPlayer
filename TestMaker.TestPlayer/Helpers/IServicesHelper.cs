using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Helpers
{
    public interface IServicesHelper
    {
        Task<T> GetAsync<T>(string url, Dictionary<string, object> parameters = null);

        Task PostAsync(string url, Dictionary<string, object> parameters = null, object data = null);

        Task<T> PostAsync<T>(string url, Dictionary<string, object> parameters = null, object data = null);
    }
}
