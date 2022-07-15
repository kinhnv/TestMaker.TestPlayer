using System.Collections.Generic;
using System.Threading.Tasks;
using TestMaker.TestPlayer.Models.User;

namespace TestMaker.TestPlayer.Helpers
{
    public interface IServicesHelper
    {
        string AccessToken { get; }

        string RefreshToken { get; }

        Task<T?> GetAsync<T>(string url, Dictionary<string, object> parameters = null);

        Task PostAsync(string url, Dictionary<string, object> parameters = null, object data = null);

        Task<T?> PostAsync<T>(string url, Dictionary<string, object> parameters = null, object data = null);

        Task<Token> GetTokenAsync(string userName, string password);
    }
}
