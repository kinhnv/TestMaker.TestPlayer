using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Models
{
    public class PreparedCandidate
    {
        public Guid EventId { get; set; }

        public string EventCode { get; set; }

        public int EventScopeType { get; set; }

        public int EventContentQuestionType { get; set; }

        public Guid CandidateId { get; set; }

        public string CandidateCode { get; set; }

        public Guid TestId { get; set; }
    }
}
