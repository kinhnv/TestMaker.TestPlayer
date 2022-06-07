export interface IPreparedQuestion {
    questionId: string;
    media: string;
    type: number;
    questionAsJson: any;
}

export interface IQuestionHelper {
    renderQuestion(answerAsJson: string): void;
    getCurrentAnswerFromHtml(): any;
}

export enum QuestionType {
    MultipleChoiceQuestion = 1,
    BlankFillingQuestion = 2,
    SortingQuestion = 3,
    MatchingQuestion = 4
}