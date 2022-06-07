using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TM.TestPlayer.Models
{
    public class PreparedCandidate
    {
        public Guid EventId { get; set; }

        public string EventCode { get; set; }

        public int EventType { get; set; }

        public Guid CandidateId { get; set; }

        public string CandidateCode { get; set; }

        public Guid TestId { get; set; }
    }
}
