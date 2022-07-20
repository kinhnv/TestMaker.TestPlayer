import { ICandidateAnswer, IPreparedQuestion, IQuestionHelper } from '../../models/question';

export class MultipleChoiceQuestionHelper implements IQuestionHelper {
    changeEventFunctions: ((event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>)[] = [];

    get questionContent(): {
        question: string;
        isSingleChoice: boolean;
        answers: string[];
    } {
        return JSON.parse(this.params.question.questionAsJson);
    }

    constructor(private params: {
        question: IPreparedQuestion,
        $content: JQuery<HTMLElement>
    }) {
    }

    renderQuestion(candidateAnswer: ICandidateAnswer) {
        let answers: string[] = candidateAnswer.answerAsJson ? JSON.parse(candidateAnswer.answerAsJson) : [];
        let correctAnswers: string[] = candidateAnswer.correntAnswerAsJson ? JSON.parse(candidateAnswer.correntAnswerAsJson) : [];
        let rationales: {
            answer: string;
            rationale: string;
        }[] = candidateAnswer.rationalesAsJson ? JSON.parse(candidateAnswer.rationalesAsJson) : [];

        let answersAsHtml = '';
        let isMarked = candidateAnswer.status == 2 ? true : false;
        let inputStyle = 'float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;';
        let type = this.questionContent.isSingleChoice ? 'radio' : 'checkbox'
        this.questionContent.answers.forEach((a, i) => {
            let isCandidateAnswer = answers.indexOf(a) >= 0 && answers.length;
            let isCorrectAnswer = correctAnswers.indexOf(a) >= 0 && correctAnswers.length;
            let labelStyle = "cursor: pointer; width: calc(100% - 34px);"
            if (isMarked) {
                if (isCorrectAnswer) {
                    labelStyle += " color: green;"
                }
                else {
                    if (isCandidateAnswer) {
                        labelStyle += " color: red;"
                    }
                }
            }

            let rationaleText = '';
            let rationale = rationales.find(x => x.answer == a);
            if (rationale) {
                rationaleText = rationale.rationale;
            }

            answersAsHtml += `
                <div class="form-group ${isMarked ? 'js__show-rationale' : ''}">
                    <input class="js__answer"
                        type="${type}" 
                        style="${inputStyle}"
                        value="${a}" ${isCandidateAnswer ? 'checked="checked"' : ''} name="answer" class="form-control" id="answer_${i}" ${isMarked ? 'disabled' : ''}/>
                    <label style="${labelStyle}" for="answer_${i}">${a}</label>
                    <div class="js__show-rationale-content" style="display: none;">
                        ${rationaleText}
                    </div>
                </div>`
        });

        this.params.$content.html(`
            <div style="margin: 0px auto;">
                <div class="js__question" style="margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;">
                    ${this.questionContent.question}
                </div>
                <div class="js__answers">
                    ${answersAsHtml}
                </div>
            </div>
        `);

        $('.js__answer').change(event => {
            this.changeEventFunctions.forEach(func => {
                func(event);
            })
        });

        $('.js__show-rationale').click(event => {
            $('.js__question-rationale-modal-content').html($(event.currentTarget).find('.js__show-rationale-content').html());
            if ((<any>$('#js__question-rationale-modal')).modal) {
                (<any>$('#js__question-rationale-modal')).modal('show');
            }
        });
    }

    addChangeEvent(func: (event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>) {
        this.changeEventFunctions.push(func);
    }

    getCurrentAnswerFromHtml(): (string | number)[] {
        if ($('.js__answers').find('input:checked').length) {
            let result = [];
            for (var i = 0; i < $('.js__answers').find('input:checked').length; i++) {
                result.push($($('.js__answers').find('input:checked')[i]).val())
            }
            return result.sort();
        }
        return null;
    }
}