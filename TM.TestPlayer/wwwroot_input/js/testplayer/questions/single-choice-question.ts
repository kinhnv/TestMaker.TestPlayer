class SingleChoiceQuestion implements Question {
    questionId: string;
    type: number;
    contentAsJson: any;

    get content(): {
        question: string;
        answers: string[];
    } {
        return JSON.parse(this.contentAsJson);
    }

    constructor(private question: Question) {
        this.questionId = this.question.questionId;
        this.type = this.question.type;
        this.contentAsJson = this.question.contentAsJson;
    }

    getQuestionAsHtml(): string {
        return `
            <div class="col-md-8" style="margin: 0px auto;">
                <div class="js__question" style="margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;">
                    ${this.content.question}
                </div>
                <div class="js__answers">
                    ${this.content.answers.map(answer => `
                    <div class="form-group">
                        <input type="radio" style="float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;"
                                value="${answer}" name="answer" class="form-control" /> <span>${answer}</span>
                    </div>`).join('')}
                </div>
            </div>
        `
    }

    getCurrentAnswerFromHtml(): string | number {
        if ($('.js__answers').find('input:checked').length) {
            return $('.js__answers').find('input:checked').val().toString();
        }
        return null;
    }
}