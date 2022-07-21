using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Models
{
    public class PreparedData
    {
        public Guid EventId { get; set; }

        public string EventCode { get; set; }

        public string EventName { get; set; }

        public int EventScopeType { get; set; }

        public int EventMarkingType { get; set; }

        public Guid CandidateId { get; set; }

        public string CandidateCode { get; set; }

        public PreparedTestWithoutRank Test { get; set; }
    }
}
