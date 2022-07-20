using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Models
{
    public class CorrectAnswer
    {
        public Guid QuestionId { get; set; }

        public string AnswerAsJson { get; set; }

        public string RationalesAsJson { get; set; }
    }
}
