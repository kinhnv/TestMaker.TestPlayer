using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestMaker.TestPlayer.Models
{
    public class PreparedTest
    {
        public class PreparedSection
        {
            public class PreparedQuestion
            {
                [JsonProperty("questionId")]
                public Guid QuestionId { get; set; }

                [JsonProperty("type")]
                public int Type { get; set; }

                [JsonProperty("media")]
                public string Media { get; set; }

                [JsonProperty("questionAsJson")]
                public string QuestionAsJson { get; set; }
            }

            public Guid SectionId { get; set; }

            public string Name { get; set; }

            public IEnumerable<PreparedQuestion> Questions { get; set; }
        }

        public Guid TestId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<PreparedSection> Sections { get; set; }
    }
}
