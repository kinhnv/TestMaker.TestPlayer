export interface IPreparedQuestion {
    questionId: string;
    media: string;
    type: number;
    questionAsJson: any;
}

export interface ICandidateAnswer {
    questionId: string;
    answerAsJson: string;
    status: number;
    correntAnswerAsJson: string;
    rationalesAsJson: string;
}

export enum CandidateAnswerStatus {
    Unseen = 0,
    Seen = 1,
    Done = 2
}

export interface IQuestionHelper {
    renderQuestion(candidateAnswer: ICandidateAnswer): void;
    getCurrentAnswerFromHtml(): any;
    addChangeEvent(func: (event: JQuery.ChangeEvent<HTMLElement, null, HTMLElement, HTMLElement>) => Promise<any>): void;
}

export enum QuestionType {
    MultipleChoiceQuestion = 1,
    BlankFillingQuestion = 2,
    SortingQuestion = 3,
    MatchingQuestion = 4
}