using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestMaker.TestPlayer.Helpers;
using TestMaker.TestPlayer.Models;

namespace TestMaker.TestPlayer.Controllers
{
    public class EventsController : Controller
    {
        private readonly IServicesHelper _servicesHelper;

        public EventsController(IServicesHelper servicesHelper)
        {
            _servicesHelper = servicesHelper;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetPublicEventsAndCandidatesAsync()
        {
            var candidates = await _servicesHelper
                .GetAsync<List<PreparedCandidate>>
                (
                    $"api/Event/Events/GetPublicEventsAndCandidates"
                );
            var result = new List<PreparedData>();

            foreach (var candidate in candidates)
            {
                result.Add(new PreparedData
                {
                    EventId = candidate.EventId,
                    EventCode = candidate.EventCode,
                    EventType = candidate.EventScopeType,
                    CandidateCode = candidate.CandidateCode,
                    CandidateId = candidate.CandidateId,
                    Test = null
                });
            }
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Prepare(PrepareCode code)
        {
            var candidate = await _servicesHelper
                .GetAsync<PreparedCandidate>
                (
                    $"api/Event/Events/GetPreparedCandidateByCode",
                    new Dictionary<string, object>
                    {
                        { "eventCode", code.EventCode },
                        { "candidateCode", code.CandidateCode }
                    }
                );

            var test = await _servicesHelper
                .GetAsync<PreparedTest>
                (
                    $"api/Test/Tests/PrepareTest",
                    new Dictionary<string, object>
                    {
                        { "testId", candidate.TestId }
                    }
                );

            PreparedTestWithoutRank preparedTestWithoutRank = null;

            if (test != null)
            {
                switch (candidate.EventContentQuestionType) {
                    case 4:
                        break;
                    default:
                        break;
                }
            }

            return new JsonResult(new PreparedData
            {
                EventId = candidate.EventId,
                EventCode = candidate.EventCode,
                CandidateId = candidate.CandidateId,
                CandidateCode = candidate.CandidateCode,
                EventType = candidate.EventScopeType,
                Test = new PreparedTestWithoutRank
                {
                    TestId = test.TestId,
                    Description = test.Description,
                    Name = test.Name,
                    Sections = test.Sections.Select(s => new PreparedTestWithoutRank.PreparedSection
                    {
                        SectionId = s.SectionId,
                        Name = s.Name,
                        Questions = s.Questions.Select(q => new PreparedTestWithoutRank.PreparedSection.PreparedQuestion
                        {
                            Media = q.Media,
                            QuestionAsJson = q.QuestionAsJson,
                            QuestionId = q.QuestionId,
                            Type = q.Type
                        })
                    })
                }
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCandidate(Guid eventId)
        {
            var candidate = await _servicesHelper
                .PostAsync<PreparedTest>
                (
                    $"api/Event/Events/CreateCandidate", 
                    new Dictionary<string, object>
                    {
                        { "eventId", eventId }
                    }
                );

            return Ok();
        }
    }
}
