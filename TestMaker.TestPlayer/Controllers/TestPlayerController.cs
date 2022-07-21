using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TestMaker.TestPlayer.Models;
using TestMaker.TestPlayer.Helpers;
using System.Collections.Generic;
using System.Linq;
using TestMaker.TestPlayer.Extensions;

namespace TestMaker.TestPlayer.Controllers
{
    public class TestPlayerController : Controller
    {
        private readonly IServicesHelper _servicesHelper;

        public TestPlayerController(IServicesHelper servicesHelper)
        {
            _servicesHelper = servicesHelper;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("GetCandidateStatus")]
        public async Task<IActionResult> GetCandidateStatusAsync([FromQuery]Guid candidateId)
        {
            var candidate = await _servicesHelper.GetAsync<CandidateForDetails>
            (
                $"api/Event/Candidates/GetCandidate",
                new Dictionary<string, object>
                {
                    { "candidateId", candidateId }
                }
            );

            return Ok(candidate.Status);
        }

        [HttpPost]
        public async Task<IActionResult> GetPreparedCandidateByCode(PrepareCode code)
        {
            var candidate = await _servicesHelper.GetAsync<PreparedCandidate>
            (
                $"api/Event/Events/GetPreparedCandidateByCode",
                new Dictionary<string, object>
                {
                    { "eventCode", code.EventCode },
                    { "candidateCode", code.CandidateCode }
                }
            );

            var test = await _servicesHelper.GetAsync<PreparedTestWithoutRank>
            (
                $"api/Event/Candidates/GetPreparedTestTemp",
                new Dictionary<string, object>
                {
                    { "candidateId", candidate.CandidateId }
                }
            );

            if (test == null)
            {
                var originTest = await _servicesHelper.GetAsync<PreparedTest>
                (
                    $"api/Test/Tests/PrepareTest",
                    new Dictionary<string, object>
                    {
                        { "testId", candidate.TestId },
                        { "eventContentQuestionType", candidate.EventContentQuestionType }
                    }
                );

                if (candidate.EventContentQuestionType == 4)
                {
                    test = new PreparedTestWithoutRank
                    {
                        TestId = originTest.TestId,
                        Description = originTest.Description,
                        Name = originTest.Name,
                        Sections = originTest.Sections.Select(s =>
                        {
                            var count = s.Questions.Count();

                            return new PreparedTestWithoutRank.PreparedSection
                            {
                                Name = s.Name,
                                SectionId = s.SectionId,
                                Questions = s.Questions.OrderBy(q => q.Rank).Take((int)Math.Round(0.5 * count)).Select(q => new PreparedTestWithoutRank.PreparedSection.PreparedQuestion
                                {
                                    QuestionId = q.QuestionId,
                                    Type = q.Type,
                                    Media = q.Media,
                                    QuestionAsJson = q.QuestionAsJson
                                })
                            };
                        })
                    };
                }
                else
                {
                    test = new PreparedTestWithoutRank
                    {
                        TestId = originTest.TestId,
                        Description = originTest.Description,
                        Name = originTest.Name,
                        Sections = originTest.Sections.Select(s => new PreparedTestWithoutRank.PreparedSection
                        {
                            Name = s.Name,
                            SectionId = s.SectionId,
                            Questions = s.Questions.RandomPosition().Select(q => new PreparedTestWithoutRank.PreparedSection.PreparedQuestion
                            {
                                QuestionId = q.QuestionId,
                                Type = q.Type,
                                Media = q.Media,
                                QuestionAsJson = q.QuestionAsJson
                            })
                        })
                    };
                }

                await _servicesHelper.PostAsync
                (
                    $"api/Event/Candidates/CreatePreparedTestTemp",
                    new Dictionary<string, object>
                    {
                        { "candidateId", candidate.CandidateId }
                    },
                    test
                );
            }

            return new JsonResult(new PreparedData
            {
                EventId = candidate.EventId,
                EventCode = candidate.EventCode,
                CandidateId = candidate.CandidateId,
                CandidateCode = candidate.CandidateCode,
                EventScopeType = candidate.EventScopeType,
                EventMarkingType = candidate.EventMarkingType,
                Test = test
            });
        }

        [HttpGet]
        [Route("GetAnswer")]
        public async Task<IActionResult> GetAnswerAsync(Guid candidateId, Guid questionId)
        {
            var candidateAnswer = await _servicesHelper.GetAsync<CandidateAnswerWithCorrentAnswer>
            (
                $"api/Event/Candidates/GetAnswer",
                new Dictionary<string, object>
                {
                    { "candidateId", candidateId },
                    { "questionId", questionId }
                }
            );

            if (candidateAnswer.Status == 2)
            {
                var correctAnswer = await _servicesHelper
                    .GetAsync<CorrectAnswer>
                    (
                        $"api/Test/Tests/GetCorrectAnswer",
                        new Dictionary<string, object>
                        {
                        { "questionId", questionId }
                        }
                    );

                candidateAnswer.CorrentAnswerAsJson = correctAnswer.AnswerAsJson;
                candidateAnswer.RationalesAsJson = correctAnswer.RationalesAsJson;
            }

            return Ok(candidateAnswer);
        }

        [HttpGet]
        [Route("GetCorrectAnswer")]
        public async Task<IActionResult> GetCorrectAnswerAsync(Guid questionId)
        {
            var answers = await _servicesHelper.GetAsync<IEnumerable<CorrectAnswer>>
            (
                $"api/Test/Tests/GetCorrectAnswer",
                new Dictionary<string, object>
                {
                    { "questionId", questionId }
                }
            );

            return Ok(answers);
        }

        [HttpGet]
        [Route("GetAnswers")]
        public async Task<IActionResult> GetAnswersAsync(Guid candidateId)
        {
            var answers = await _servicesHelper.GetAsync<IEnumerable<CandidateAnswer>>
            (
                $"api/Event/Candidates/GetAnswers",
                new Dictionary<string, object>
                {
                    { "candidateId", candidateId }
                }
            );

            return Ok(answers);
        }

        [HttpGet]
        [Route("GetCorrectAnswers")]
        public async Task<IActionResult> GetCorrectAnswersAsync(Guid testId)
        {
            var answers = await _servicesHelper
                .GetAsync<IEnumerable<CorrectAnswer>>
                (
                    $"api/Test/Tests/GetCorrectAnswers",
                    new Dictionary<string, object>
                    {
                        { "testId", testId }
                    }
                );

            return Ok(answers);
        }

        [HttpPost]
        [Route("SubmitQuestion")]
        public async Task<IActionResult> SubmitQuestionAsync(Guid candidateId, Guid questionId, string answerAsJson, int? candidateAnswerStatus = null, bool marking = false)
        {
            await _servicesHelper.PostAsync
                (
                    $"api/Event/Candidates/SubmitQuestion",
                    parameters: null,
                    new
                    {
                        candidateId = candidateId,
                        questionId = questionId,
                        answerAsJson = answerAsJson,
                        candidateAnswerStatus = candidateAnswerStatus,
                        marking = marking
                    }
                );

            return Ok();
        }

        [HttpPost]
        [Route("Submit")]
        public async Task<IActionResult> SubmitAsync(Guid candidateId)
        {
            await _servicesHelper.PostAsync
            (
                $"api/Event/Candidates/Submit",
                parameters: new Dictionary<string, object>
                {
                    { "candidateId", candidateId }
                }
            );

            var answers = await _servicesHelper.GetAsync<IEnumerable<CandidateAnswer>>
            (
                $"api/Event/Candidates/GetAnswers",
                new Dictionary<string, object>
                {
                    { "candidateId", candidateId }
                }
            );

            if (!string.IsNullOrEmpty(AccessToken) && answers?.Any() == true)
            {
                await _servicesHelper.PostAsync
                (
                    $"api/Test/Tests/SaveAnswers",
                    null,
                    answers
                );
            }

            return Ok();
        }

        [HttpPost]
        [Route("Clear")]
        public async Task<IActionResult> ClearAsync(Guid candidateId)
        {
            await _servicesHelper.PostAsync
                   (
                       $"api/Event/Candidates/Clear",
                       parameters: new Dictionary<string, object>
                       {
                           { "candidateId" ,candidateId }
                       }
                   );   

            return Ok();
        }

        private string AccessToken
        {
            get
            {
                HttpContext.Request.Cookies.TryGetValue("ACCESS_TOKEN", out string accessToken);

                return accessToken;
            }
        }
    }
}
