interface TestPlayerControllerParams {
    eventCode: string;
    candidateCode: string;
    prepareUrl: string;
}

class TestPlayerController {
    get currentQuestionId(): string {
        let params = location.hash.replace('#', '').split('&').filter(x => x.startsWith('questionId'));
        if (!params.length)
            return null;
        return params[0].split('=')[1];
    }

    get currentSection(): Section {
        let test: PreparedTest = window['test'];

        if (test.sections && test.sections.length) {
            var section = test.sections[0];
            for (var i = 0; i < test.sections.length; i++) {
                var length = test.sections[i].questions.filter(x => x.questionId == this.currentQuestionId).length
                if (length) {
                    section = test.sections[i];
                }
            }

            return section;
        }
        return null;
    }

    get currentQuestion(): Question {
        if (this.currentSection) {
            var question = this.currentSection.questions[0];
            if (this.currentSection.questions && this.currentSection.questions.length) {
                if (this.currentQuestionId) {
                    question = this.currentSection.questions.filter(x => x.questionId == this.currentQuestionId)[0];
                }
            }
            return question;
        }
        return null;
    }

    get nextQuestion(): Question {
        let questions = this.currentSection.questions;
        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);

        if (index < questions.length - 1) {
            return questions[index + 1];
        }
        return null;
    }

    get preventQuestion(): Question {
        let questions = this.currentSection.questions;
        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);

        if (index > 0) {
            return questions[index - 1];
        }
        return null;
    }

    constructor(private params: TestPlayerControllerParams) {
        $.ajax({
            method: 'POST',
            url: this.params.prepareUrl,
            data: {
                eventCode: this.params.eventCode,
                candidateCode: this.params.candidateCode
            }
        }).then((test) => {
            if (test) {
                window['test'] = test;
                $('.js__test-name').html(test.name);
                this.renderCurrentQuestion();
            }
        });

        $('.js__next-question').click((event) => {
            location.href = location.href.replace(location.hash, '') + '#questionId=' + this.nextQuestion.questionId;
            this.renderCurrentQuestion();
        })
        $('.js__prevent-question').click((event) => {
            location.href = location.href.replace(location.hash, '') + '#questionId=' + this.preventQuestion.questionId;
            this.renderCurrentQuestion();
        })
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
            $('.js__next-question').show();
        }
        else {
            $('.js__next-question').hide();
        }

        if (currentQuestion) {
            switch (currentQuestion.type) {
                case QuestionType.SingleChoiceQuestion: {
                    $('.js__container').html(new SingleChoiceQuestion(currentQuestion).getQuestionAsHtml());
                    break;
                }
                case QuestionType.MultipleChoiceQuestion: {
                    $('.js__container').html(new MultipleChoiceQuestion(currentQuestion).getQuestionAsHtml());
                    break;
                }
            }
        }
    }

    private getAnswer(question: Question) {
        switch (question.type) {
            case QuestionType.SingleChoiceQuestion: {
                return new SingleChoiceQuestion(question).getCurrentAnswerFromHtml();
            }
            case QuestionType.MultipleChoiceQuestion: {
                return new MultipleChoiceQuestion(question).getCurrentAnswerFromHtml();
            }
            default:
        }
    }
}

if ($('[test-player-params]')) {
    let paramsAsJson = $('[test-player-params]').attr('test-player-params');
    let params = JSON.parse(paramsAsJson)
    new TestPlayerController(params);
}