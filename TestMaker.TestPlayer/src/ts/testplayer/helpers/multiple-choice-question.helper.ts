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
        let answersAsHtml = '';
        this.questionContent.answers.forEach((a, i) => {
            if (answers.indexOf(a) >= 0 && answers.length) {
                answersAsHtml += `
                <div class="form-group">
                    <input class="js__answer" 
                        type="${this.questionContent.isSingleChoice ? 'radio' : 'checkbox'}" 
                        style="float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;"
                        value="${a}" checked="checked" name="answer" class="form-control" id="answer_${i}"/> 
                    <span for="answer_${i}">${a}</span>
                </div>`
            }
            else {
                answersAsHtml += `
                <div class="form-group">
                    <input class="js__answer" 
                        type="${this.questionContent.isSingleChoice ? 'radio' : 'checkbox'}" 
                        style="float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;"
                        value="${a}" name="answer" class="form-control" id="answer_${i}"/>
                    <span for="answer_${i}">${a}</span>
                </div>`
            }
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
        })
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