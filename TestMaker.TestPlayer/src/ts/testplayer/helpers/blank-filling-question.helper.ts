import { ICandidateAnswer, IPreparedQuestion, IQuestionHelper } from '../../models/question';

export class BlankFillingQuestionHelper implements IQuestionHelper {
    changeEventFunctions: ((event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>)[] = [];

    get questionContent(): {
        question: string;
        blanks: {
            position: string;
            answers: string[]
        }[];
    } {
        return JSON.parse(this.params.question.questionAsJson);
    }

    constructor(private params: {
        question: IPreparedQuestion,
        $content: JQuery<HTMLElement>
    }) {
    }

    getSelectAtHtml(blank: {
        position: string;
        answers: string[]
    }, answer: string): string {
        let optionsAsHtml = blank.answers.map(a => `<option value="${a}" ${a == answer ? 'selected="selected"': ''}>${a}</option>`).join('');
        return `
            <select class="js__blank js__${blank.position}" data-position="${blank.position}">
                ${optionsAsHtml}
            </select>`;
    }

    renderQuestion(candidateAnswer: ICandidateAnswer) {
        const answers: {
            position: string;
            answer: string;
        }[] = !candidateAnswer.answerAsJson ? null : JSON.parse(candidateAnswer.answerAsJson);
        let question = this.questionContent.question;
        this.questionContent.blanks.forEach(blank => {
            let select = this.getSelectAtHtml(blank, !answers ? null : answers.find(a => a.position == blank.position).answer);
            question = question.replace(blank.position, select);
        })

        this.params.$content.html(`
            <div style="margin: 0px auto;">
                <div class="js__question" style="margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;">
                    ${question}
                </div>
            </div>
        `)
    }

    addChangeEvent(func: (event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>) {
        this.changeEventFunctions.push(func);
    }

    getCurrentAnswerFromHtml() {
        var result: {
            position: string;
            answer: string;
        }[] = [];
        this.params.$content.find('.js__blank').each((index, select) => {
            const $select = $(select);
            const position = $select.data('position');
            const answer = $select.find('option:selected').val() + '';
            result.push({
                answer: answer,
                position: position
            })
        })
        return result.sort((a, b) => {
            if (a.position < b.position) { return -1; }
            if (a.position > b.position) { return 1; }
            return 0;
        });
    }
}