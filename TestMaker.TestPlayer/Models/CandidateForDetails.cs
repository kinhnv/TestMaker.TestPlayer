using System;
using System.ComponentModel.DataAnnotations;

namespace TestMaker.TestPlayer.Models
{
    public class CandidateForDetails
    {
        public Guid EventId { get; set; }

        public Guid CandidateId { get; set; }

        [StringLength(8)]
        public string Code { get; set; }

        public int Status { get; set; }
    }
}
