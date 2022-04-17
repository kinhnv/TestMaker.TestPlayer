interface Question {
    questionId: string;
    type: number;
    contentAsJson: any;
    getQuestionAsHtml(): string;
    getCurrentAnswerFromHtml(): any;
}

enum QuestionType {
    SingleChoiceQuestion = 1,
    MultipleChoiceQuestion = 2
}