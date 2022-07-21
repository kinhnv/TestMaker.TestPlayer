import { CandidateAnswerStatus, ICandidateAnswer, IPreparedQuestion, IQuestionHelper, QuestionType } from '../models/question';
import { SortingQuestionHelper } from './helpers/sorting-question.helper';
import { MultipleChoiceQuestionHelper } from './helpers/multiple-choice-question.helper';
import { IPreparedTest } from '../models/prepared-test';
import { ISection } from '../models/section';
import { IPreparedData } from '../models/prepared-data';
import { BlankFillingQuestionHelper } from './helpers/blank-filling-question.helper';
import { MatchingQuestionHelper } from './helpers/matching-question.helper';

interface ITestPlayerControllerParams {
    homeUrl: string;
    eventCode: string;
    candidateCode: string;
    getPreparedCandidateByCodeUrl: string;
    submitQuestionUrl: string;
    getAnswerUrl: string;
    getAnswersUrl: string;
    getCorrectAnswersUrl: string;
    submitUrl: string;
    saveQuestionResultUrl: string;
    clearUrl: string;
    getCandidateStatusUrl: string;
}

class TestPlayerController {
    private data: IPreparedData = null;
    private questionHelper: IQuestionHelper = null;

    get $ContentElement(): JQuery<HTMLElement> {
        return $('.js__container');
    }

    get isSummary(): boolean {
        return location.hash.replace('#', '').indexOf('summary') >= 0;
    }

    get test(): IPreparedTest {
        return this.data.test;
    }

    get candidateId(): string {
        return this.data.candidateId;
    }

    get currentSection(): ISection {
        var currentQuestionId = null;
        let params = location.hash.replace('#', '').split('&').filter(x => x.startsWith('questionId'));
        if (params.length)
            currentQuestionId = params[0].split('=')[1];

        if (!this.test)
            return null;

        if (this.test.sections && this.test.sections.length) {
            var section = this.test.sections[0];
            if (currentQuestionId) {
                for (var i = 0; i < this.test.sections.length; i++) {
                    var length = this.test.sections[i].questions.filter(x => x.questionId == currentQuestionId).length
                    if (length) {
                        section = this.test.sections[i];
                    }
                }
            }

            return section;
        }
        return null;
    }

    get currentQuestion(): IPreparedQuestion {
        var currentQuestionId = null;
        let params = location.hash.replace('#', '').split('&').filter(x => x.startsWith('questionId'));
        if (params.length)
            currentQuestionId = params[0].split('=')[1];

        if (this.currentSection) {
            var question = this.currentSection.questions[0];
            if (this.currentSection.questions && this.currentSection.questions.length) {
                if (currentQuestionId) {
                    question = this.currentSection.questions.filter(x => x.questionId == currentQuestionId)[0];
                }
            }
            return question;
        }
        return null;
    }

    get nextQuestion(): IPreparedQuestion {
        let questions = this.currentSection.questions;
        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);

        if (index < questions.length - 1) {
            return questions[index + 1];
        }
        return null;
    }

    get preventQuestion(): IPreparedQuestion {
        let questions = this.currentSection.questions;
        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);

        if (index > 0) {
            return questions[index - 1];
        }
        return null;
    }

    constructor(private params: ITestPlayerControllerParams) {
        var code = this.getCookie('ACCESS_CODE');
        if (code) {
            var codeAsArray = code.split('_');
            $.ajax({
                method: 'POST',
                url: this.params.getPreparedCandidateByCodeUrl,
                data: {
                    eventCode: codeAsArray[0],
                    candidateCode: codeAsArray[1]
                }
            }).then((data: IPreparedData) => {
                this.data = data;
                if (data) {
                    $('.js__test-name').html(data.test.name);
                    if (this.isSummary) {
                        this.renderSummary();
                    }
                    else {
                        this.renderCurrentQuestion();
                    }
                }
            });

            $('.js__submit-question').click((event) => {
                this.submitCurrentQuestion().then(() => {
                    this.renderCurrentQuestion();
                    $('.js__submit-question').hide();
                });
            });
            $('.js__next-question').click((event) => {
                this.submitCurrentQuestion().then(() => {
                    location.href = this.getQuestionHerf(this.nextQuestion.questionId);
                    this.renderCurrentQuestion();
                });
            });
            $('.js__prevent-question').click((event) => {
                this.submitCurrentQuestion().then(() => {
                    location.href = this.getQuestionHerf(this.preventQuestion.questionId);
                    this.renderCurrentQuestion();
                });
            });
            $('.js__summary, .js__test-name').click((event) => {
                this.submitCurrentQuestion().then(() => {
                    location.href = location.href.replace(location.hash, '') + '#summary';
                    this.renderSummary();
                });
            })
        }
    }

    private renderCurrentQuestion() {
        let currentQuestion = this.currentQuestion;

        if (this.preventQuestion) {
            $('.js__prevent-question').show();
        }
        else {
            $('.js__prevent-question').hide();
        }

        if (this.nextQuestion) {
            $('.js__summary').hide();
            $('.js__next-question').show();
        }
        else {
            $('.js__next-question').hide();
            $('.js__summary').show();
        }

        switch (currentQuestion.type) {
            case QuestionType.MultipleChoiceQuestion: {
                this.questionHelper = new MultipleChoiceQuestionHelper({
                    question: currentQuestion,
                    $content: $('.js__container')
                });
                break;
            }
            case QuestionType.BlankFillingQuestion: {
                this.questionHelper = new BlankFillingQuestionHelper({
                    question: currentQuestion,
                    $content: $('.js__container')
                });
                break;
            }
            case QuestionType.MatchingQuestion: {
                this.questionHelper = new MatchingQuestionHelper({
                    question: currentQuestion,
                    $content: $('.js__container')
                });
                break;
            }
            case QuestionType.SortingQuestion: {
                this.questionHelper = new SortingQuestionHelper({
                    question: currentQuestion,
                    $content: $('.js__container')
                });
                break;
            }
        }

        this.questionHelper.addChangeEvent(event => {
            return new Promise((resole, reject) => {
                if (this.data.eventMarkingType == 2) {
                    $('.js__submit-question').show();
                }

                resole(null);
            })
        });

        this.questionHelper.addChangeEvent((event) => {
            return new Promise((resole, reject) => {
                var currentStatus = $('.js__question-status').attr('question-status');
                if (currentStatus == 'seen') {
                    currentStatus = 'doing';
                }
                $('.js__question-status').attr('question-status', currentStatus);
            });
        });

        this.getCurrentAnswerFromServer().then(candidateAnswer => {
            if (currentQuestion.media) {
                $('.js__media').html(`
                    <audio controls>
                      <source src="${currentQuestion.media}" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio>
                `);
            }

            var questionStatus = candidateAnswer.status == 0 ? 'seen' :
                candidateAnswer.status == 1 || candidateAnswer.status == 3 ? 'doing' :
                    candidateAnswer.status == 2 ? 'marked' : '';

            $('.js__question-status').attr('question-status', questionStatus);

            this.questionHelper.renderQuestion(candidateAnswer);
        })
    }

    private getCurrentAnswerFromServer(): Promise<ICandidateAnswer> {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: this.params.getAnswerUrl,
                data: {
                    candidateId: this.candidateId,
                    questionId: this.currentQuestion.questionId
                }
            }).then(answer => {
                resolve(answer);
            })
        })
    }

    private submitCurrentQuestion(): Promise<void> {
        var questionStatus = $('.js__question-status').attr('question-status');

        return new Promise<void>((resolve, reject) => {
            let answer = this.getCurrentAnswerAsJson();
            if (answer) {
                return $.ajax({
                    method: 'POST',
                    url: this.params.submitQuestionUrl,
                    data: {
                        candidateId: this.candidateId,
                        questionId: this.currentQuestion.questionId,
                        answerAsJson: answer,
                        candidateAnswerStatus: questionStatus == 'seen' ? 1 :
                            questionStatus == 'doing' ? 3 :
                                questionStatus == 'marked' ? 2 : null,
                        marking: this.data.eventMarkingType == 2 ? true : false
                    }
                }).then(() => {
                    resolve()
                });
            }
            else {
                resolve()
            }
        });
    }

    private getCurrentAnswerAsJson() {
        var answer = this.questionHelper.getCurrentAnswerFromHtml();
        if (answer) {
            return JSON.stringify(answer);
        } else {
            return '';
        }
    }

    private renderSummary() {
        $('.js__prevent-question').hide();
        $('.js__next-question').hide();
        $('.js__summary').hide();
        $.ajax({
            method: 'GET',
            url: this.params.getAnswersUrl,
            data: {
                candidateId: this.candidateId
            }
        }).then((answers: { questionId: string, answerAsJson: string }[]) => {
            var html = '';
            this.test.sections.forEach(section => {
                var questionsAsHtml = '';
                section.questions.forEach((question, index) => {
                    let backgroundColor = ''
                    let answer = answers.find(x => x.questionId == question.questionId);
                    if (answer) {
                        backgroundColor = 'background: #adb5bd';
                    } else {
                        backgroundColor = '';
                    }

                    questionsAsHtml += `<a class="js__go-to-question" data-question-id="${question.questionId}" style="padding: 8px 8px;box-sizing: content-box;display: inline-block;width: 24px;text-align: center;${backgroundColor};border: solid 1px #adb5bd;border-radius: 50%;margin: 5px; cursor: pointer;">${index + 1}</a>`
                });

                html += `
                    <div>
                        <div>
                            <h3>${section.name}</h3>
                        </div>
                        <div>
                            ${questionsAsHtml}
                        </div>
                    </div>
                    <div style="text-align: center">
                        <a class="btn btn-light js__submit" style="cursor: pointer;display: none;">Nộp bài kiểm tra</a>
                        <a class="btn btn-light js__close" style="cursor: pointer">Thoát bài kiếm tra</a>
                    </div>`
            });
            this.$ContentElement.html(html);

            $('.js__go-to-question').click((event) => {
                let questionId = $(event.target).data('question-id');
                location.href = this.getQuestionHerf(questionId);
                this.renderCurrentQuestion();
            });

            $('.js__close').click((event) => {
                location.href = this.params.homeUrl
            });


            $.ajax({
                method: 'GET',
                url: this.params.getCandidateStatusUrl,
                data: {
                    candidateId: this.candidateId
                }
            }).then((status) => {
                if (status == 3) {
                    this.mark();
                }
                else {
                    $('.js__submit').show();
                }
            })

            $('.js__submit').click((event) => {
                $.ajax({
                    method: 'POST',
                    url: this.params.submitUrl,
                    data: {
                        candidateId: this.candidateId
                    }
                }).then(() => {
                    this.mark();
                    $('.js__submit').hide();
                })
            });
        })
    }

    private mark() {
        $.ajax({
            method: 'GET',
            url: this.params.getCorrectAnswersUrl,
            data: {
                testId: this.test.testId
            }
        }).then((correctAnswers: { questionId: string, answerAsJson: string }[]) => {
            $.ajax({
                method: 'GET',
                url: this.params.getAnswersUrl,
                data: {
                    candidateId: this.candidateId
                }
            }).then((answers: { questionId: string, answerAsJson: string }[]) => {
                let result: {
                    questionId: string;
                    isCorrect: boolean;
                }[] = [];
                answers.forEach(answer => {
                    correctAnswers.forEach(correctAnswer => {
                        if (answer.questionId == correctAnswer.questionId) {
                            if (answer.answerAsJson == correctAnswer.answerAsJson) {
                                result.push({
                                    questionId: answer.questionId,
                                    isCorrect: true
                                });
                            } else {
                                result.push({
                                    questionId: answer.questionId,
                                    isCorrect: false
                                });
                            }
                        }
                    })
                });

                $.ajax({
                    method: 'POST',
                    url: this.params.saveQuestionResultUrl,
                    data: result
                });

                $('.js__go-to-question').each((index, element) => {
                    let questionId = $(element).data('question-id');
                    let resultItem = result.find(x => x.questionId == questionId);
                    if (resultItem) {
                        if (!resultItem.isCorrect) {
                            $(element).css('background', '#dc3545');
                        }
                        else {
                            $(element).css('background', '#28a745');
                        }
                    }
                })
            })
        })
    }

    private getQuestionHerf(questionId: string) {
        return location.href.replace(location.hash, '') + '#questionId=' + questionId;
    }

    private getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

if ($('[test-player-params]')) {
    let paramsAsJson = $('[test-player-params]').attr('test-player-params');
    let params = JSON.parse(paramsAsJson)
    new TestPlayerController(params);
}