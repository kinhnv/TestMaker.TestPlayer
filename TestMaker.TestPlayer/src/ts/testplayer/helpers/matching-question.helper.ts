import { ICandidateAnswer, IPreparedQuestion, IQuestionHelper } from '../../models/question';

export class MatchingQuestionHelper implements IQuestionHelper {
    changeEventFunctions: ((event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>)[] = [];

    get questionContent(): {
        question: string;
        answers: {
            from: string;
            target: string;
        }[];
    } {
        return JSON.parse(this.params.question.questionAsJson);
    }

    private from: number = 0;

    constructor(private params: {
        question: IPreparedQuestion,
        $content: JQuery<HTMLElement>
    }) {
    }

    renderQuestion(candidateAnswer: ICandidateAnswer) {
        const answers: {
            from: string;
            target: string;
        }[] = !candidateAnswer.answerAsJson ? null : JSON.parse(candidateAnswer.answerAsJson);
        this.params.$content.html(`
            <div style="margin: 0px auto;">
                <div class="js__question" style="margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;">
                    ${this.questionContent.question}
                </div>
                <div class="js__answers">
                    ${this.questionContent.answers.map(answer => `
                        <div class="js__answer js__answer-from" 
                            style="border-bottom: 1px solid #c3c3c3;padding: 8px;margin-bottom:4px;width: calc(50% - 2px);margin-right: 4px;float: left;">
                            <span class="js__answer-content" style="padding: 3px 0px;text-align: justify;">
                                ${answer.from}
                            </span>
                        </div>
                        <div class="js__answer js__answer-target"
                            style="border: 1px solid #c3c3c3;padding: 8px;border-radius: 4px;margin-bottom:4px;width: calc(50% - 2px);float: left;">
                            <span class="js__answer-content" style="padding: 3px 0px;text-align: justify;">
                                ${answers && answers.find(x => x.from == answer.from) ? answers.find(x => x.from == answer.from).target : answer.target}
                            </span>
                        </div>
                        <div style="clear: left;"></div>
                    `).join('')}
                </div>
            </div>
        `);

        $('.js__answer-target').click((event) => {
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

    getCurrentAnswerFromHtml(): {
        from: string;
        target: string;
    }[] {
        const result: {
            from: string;
            target: string;
        }[] = [];

        const from = this.params.$content.find('.js__answer-from').find('.js__answer-content').map((index, element) => $(element).html().trim());
        const target = this.params.$content.find('.js__answer-target').find('.js__answer-content').map((index, element) => $(element).html().trim());

        this.params.$content.find('.js__answer-from').each((index) => {
            result.push({
                from: from[index],
                target: target[index]
            });
        });

        return result.sort((a, b) => {
            if (a.from < b.from) { return -1; }
            if (a.from > b.from) { return 1; }
            return 0;
        });
    }
}