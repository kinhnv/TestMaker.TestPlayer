import { ICandidateAnswer, IPreparedQuestion, IQuestionHelper } from '../../models/question';

export class SortingQuestionHelper implements IQuestionHelper {
    changeEventFunctions: ((event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>)[] = [];

    get questionContent(): {
        question: string;
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
        const answers: string[] = !candidateAnswer.answerAsJson ? null : JSON.parse(candidateAnswer.answerAsJson);
        this.params.$content.html(`
            <div style="margin: 0px auto;">
                <div class="js__question" style="margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;">
                    ${this.questionContent.question}
                </div>
                <div class="js__answers">
                    ${(answers ?? this.questionContent.answers).map(answer => `
                        <div class="js__answer" 
                            style="border: 1px solid #c3c3c3;padding: 8px;border-radius: 4px;margin-bottom:4px;">
                            <span class="js__answer-content" style="padding: 3px 0px;text-align: justify;">
                                ${answer}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);

        $('.js__answer').click((event) => {
            const $answerElement = $(event.target);

            if ($('.js__answer-selected').length) {
                const $answerSelectedElement = $('.js__answer-selected');

                const answer = $answerSelectedElement.find('.js__answer-content').html();
                $answerSelectedElement.find('.js__answer-content').html($answerElement.find('.js__answer-content').html());
                $answerElement.find('.js__answer-content').html(answer);

                $answerSelectedElement.removeClass('js__answer-selected');
                $answerSelectedElement.css('background-color', 'white');
            } else {
                $answerElement.addClass('js__answer-selected');
                $answerElement.css('background-color', '#c3c3c3');
            }
        });
    }

    addChangeEvent(func: (event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>) {
        this.changeEventFunctions.push(func);
    }

    getCurrentAnswerFromHtml(): string[] {
        const result: string[] = [];

        this.params.$content.find('.js__answer-content').each((index, answerContentElement) => {
            result.push($(answerContentElement).html().trim());
        });

        return result.sort((a, b) => {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        });;
    }
}