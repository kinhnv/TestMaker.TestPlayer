using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TM.TestPlayer.Models
{
    public enum ServiceType
    {
        GET,
        POST,
        PUT,
        DELETE
    }

    public class ServiceRequest
    {
        public string Name { get; set; }

        public ServiceType ServiceType { get; set; }

        public Dictionary<string, object> Params { get; set; }

        public Dictionary<string, object> Body { get; set; }
    }
}
