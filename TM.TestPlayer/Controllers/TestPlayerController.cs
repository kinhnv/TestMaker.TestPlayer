using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TM.TestPlayer.Models;
using TM.TestPlayer.Helpers;
using System.Collections.Generic;

namespace TM.TestPlayer.Controllers
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

        [HttpPost]
        public async Task<IActionResult> GetPreparedCandidateByCode(PrepareCode code)
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

            return new JsonResult(new PreparedData
            {
                EventId = candidate.EventId,
                EventCode = candidate.EventCode,
                CandidateId = candidate.CandidateId,
                CandidateCode = candidate.CandidateCode,
                Test = test
            });
        }

        [HttpGet]
        [Route("GetAnswer")]
        public async Task<IActionResult> GetAnswerAsync(Guid candidateId, Guid questionId)
        {
            var answerAsJson = await _servicesHelper.GetAsync<String>
                   (
                       $"api/Event/Candidates/GetAnswer",
                       new Dictionary<string, object>
                       {
                        { "candidateId", candidateId },
                        { "questionId", questionId }
                       }
                   );

            return Ok(answerAsJson);
        }

        [HttpGet]
        [Route("GetAnswers")]
        public async Task<IActionResult> GetAnswersAsync(Guid candidateId)
        {
            var answers = await _servicesHelper
                .GetAsync<IEnumerable<CandidateAnswer>>
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
        public async Task<IActionResult> SubmitQuestionAsync(Guid candidateId, Guid questionId, string answerAsJson)
        {
            await _servicesHelper.PostAsync
                (
                    $"api/Event/Candidates/SubmitQuestion",
                    parameters: null,
                    new
                    {
                        candidateId = candidateId,
                        questionId = questionId,
                        answerAsJson = answerAsJson
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
                           { "candidateId" ,candidateId }
                       }
                   );

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
    }
}
