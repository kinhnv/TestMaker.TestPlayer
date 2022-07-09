/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/models/question.ts":
/*!***********************************!*\
  !*** ./src/ts/models/question.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"QuestionType\": () => (/* binding */ QuestionType)\n/* harmony export */ });\nvar QuestionType;\n(function (QuestionType) {\n    QuestionType[QuestionType[\"MultipleChoiceQuestion\"] = 1] = \"MultipleChoiceQuestion\";\n    QuestionType[QuestionType[\"BlankFillingQuestion\"] = 2] = \"BlankFillingQuestion\";\n    QuestionType[QuestionType[\"SortingQuestion\"] = 3] = \"SortingQuestion\";\n    QuestionType[QuestionType[\"MatchingQuestion\"] = 4] = \"MatchingQuestion\";\n})(QuestionType || (QuestionType = {}));\n\n\n//# sourceURL=webpack://asp.net/./src/ts/models/question.ts?");

/***/ }),

/***/ "./src/ts/testplayer/helpers/blank-filling-question.helper.ts":
/*!********************************************************************!*\
  !*** ./src/ts/testplayer/helpers/blank-filling-question.helper.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BlankFillingQuestionHelper\": () => (/* binding */ BlankFillingQuestionHelper)\n/* harmony export */ });\nclass BlankFillingQuestionHelper {\n    constructor(params) {\n        this.params = params;\n    }\n    get questionContent() {\n        return JSON.parse(this.params.question.questionAsJson);\n    }\n    getSelectAtHtml(blank, answer) {\n        let optionsAsHtml = blank.answers.map(a => `<option value=\"${a}\" ${a == answer ? 'selected=\"selected\"' : ''}>${a}</option>`).join('');\n        return `\n            <select class=\"js__blank js__${blank.position}\" data-position=\"${blank.position}\">\n                ${optionsAsHtml}\n            </select>`;\n    }\n    renderQuestion(answerAsJson) {\n        const answers = !answerAsJson ? null : JSON.parse(answerAsJson);\n        let question = this.questionContent.question;\n        this.questionContent.blanks.forEach(blank => {\n            let select = this.getSelectAtHtml(blank, !answers ? null : answers.find(a => a.position == blank.position).answer);\n            question = question.replace(blank.position, select);\n        });\n        this.params.$content.html(`\n            <div style=\"margin: 0px auto;\">\n                <div class=\"js__question\" style=\"margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;\">\n                    ${question}\n                </div>\n            </div>\n        `);\n    }\n    getCurrentAnswerFromHtml() {\n        var result = [];\n        this.params.$content.find('.js__blank').each((index, select) => {\n            const $select = $(select);\n            const position = $select.data('position');\n            const answer = $select.find('option:selected').val() + '';\n            result.push({\n                answer: answer,\n                position: position\n            });\n        });\n        return result.sort((a, b) => {\n            if (a.position < b.position) {\n                return -1;\n            }\n            if (a.position > b.position) {\n                return 1;\n            }\n            return 0;\n        });\n    }\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/testplayer/helpers/blank-filling-question.helper.ts?");

/***/ }),

/***/ "./src/ts/testplayer/helpers/matching-question.helper.ts":
/*!***************************************************************!*\
  !*** ./src/ts/testplayer/helpers/matching-question.helper.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MatchingQuestionHelper\": () => (/* binding */ MatchingQuestionHelper)\n/* harmony export */ });\nclass MatchingQuestionHelper {\n    constructor(params) {\n        this.params = params;\n        this.from = 0;\n    }\n    get questionContent() {\n        return JSON.parse(this.params.question.questionAsJson);\n    }\n    renderQuestion(answerAsJson) {\n        const answers = !answerAsJson ? null : JSON.parse(answerAsJson);\n        this.params.$content.html(`\n            <div style=\"margin: 0px auto;\">\n                <div class=\"js__question\" style=\"margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;\">\n                    ${this.questionContent.question}\n                </div>\n                <div class=\"js__answers\">\n                    ${this.questionContent.answers.map(answer => `\n                        <div class=\"js__answer js__answer-from\" \n                            style=\"border-bottom: 1px solid #c3c3c3;padding: 8px;margin-bottom:4px;width: calc(50% - 2px);margin-right: 4px;float: left;\">\n                            <span class=\"js__answer-content\" style=\"padding: 3px 0px;text-align: justify;\">\n                                ${answer.from}\n                            </span>\n                        </div>\n                        <div class=\"js__answer js__answer-target\"\n                            style=\"border: 1px solid #c3c3c3;padding: 8px;border-radius: 4px;margin-bottom:4px;width: calc(50% - 2px);float: left;\">\n                            <span class=\"js__answer-content\" style=\"padding: 3px 0px;text-align: justify;\">\n                                ${answers && answers.find(x => x.from == answer.from) ? answers.find(x => x.from == answer.from).target : answer.target}\n                            </span>\n                        </div>\n                        <div style=\"clear: left;\"></div>\n                    `).join('')}\n                </div>\n            </div>\n        `);\n        $('.js__answer-target').click((event) => {\n            const $answerElement = $(event.target);\n            if ($('.js__answer-selected').length) {\n                const $answerSelectedElement = $('.js__answer-selected');\n                const answer = $answerSelectedElement.find('.js__answer-content').html();\n                $answerSelectedElement.find('.js__answer-content').html($answerElement.find('.js__answer-content').html());\n                $answerElement.find('.js__answer-content').html(answer);\n                $answerSelectedElement.removeClass('js__answer-selected');\n                $answerSelectedElement.css('background-color', 'white');\n            }\n            else {\n                $answerElement.addClass('js__answer-selected');\n                $answerElement.css('background-color', '#c3c3c3');\n            }\n        });\n    }\n    getCurrentAnswerFromHtml() {\n        const result = [];\n        const from = this.params.$content.find('.js__answer-from').find('.js__answer-content').map((index, element) => $(element).html().trim());\n        const target = this.params.$content.find('.js__answer-target').find('.js__answer-content').map((index, element) => $(element).html().trim());\n        this.params.$content.find('.js__answer-from').each((index) => {\n            result.push({\n                from: from[index],\n                target: target[index]\n            });\n        });\n        return result.sort((a, b) => {\n            if (a.from < b.from) {\n                return -1;\n            }\n            if (a.from > b.from) {\n                return 1;\n            }\n            return 0;\n        });\n    }\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/testplayer/helpers/matching-question.helper.ts?");

/***/ }),

/***/ "./src/ts/testplayer/helpers/multiple-choice-question.helper.ts":
/*!**********************************************************************!*\
  !*** ./src/ts/testplayer/helpers/multiple-choice-question.helper.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MultipleChoiceQuestionHelper\": () => (/* binding */ MultipleChoiceQuestionHelper)\n/* harmony export */ });\nclass MultipleChoiceQuestionHelper {\n    constructor(params) {\n        this.params = params;\n    }\n    get questionContent() {\n        return JSON.parse(this.params.question.questionAsJson);\n    }\n    renderQuestion(answerAsJson) {\n        let answers = answerAsJson ? JSON.parse(answerAsJson) : [];\n        let answersAsHtml = '';\n        this.questionContent.answers.forEach(a => {\n            if (answers.indexOf(a) >= 0 && answers.length) {\n                answersAsHtml += `\n                <div class=\"form-group\">\n                    <input\n                        type=\"${this.questionContent.isSingleChoice ? 'radio' : 'checkbox'}\" \n                        style=\"float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;\"\n                        value=\"${a}\" checked=\"checked\" name=\"answer\" class=\"form-control\" /> \n                    <span>${a}</span>\n                </div>`;\n            }\n            else {\n                answersAsHtml += `\n                <div class=\"form-group\">\n                    <input \n                        type=\"${this.questionContent.isSingleChoice ? 'radio' : 'checkbox'}\" \n                        style=\"float: left; height: 24px; width: 24px; margin-right: 10px; box-shadow: none;\"\n                        value=\"${a}\" name=\"answer\" class=\"form-control\" /> \n                    <span>${a}</span>\n                </div>`;\n            }\n        });\n        this.params.$content.html(`\n            <div style=\"margin: 0px auto;\">\n                <div class=\"js__question\" style=\"margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;\">\n                    ${this.questionContent.question}\n                </div>\n                <div class=\"js__answers\">\n                    ${answersAsHtml}\n                </div>\n            </div>\n        `);\n    }\n    getCurrentAnswerFromHtml() {\n        if ($('.js__answers').find('input:checked').length) {\n            let result = [];\n            for (var i = 0; i < $('.js__answers').find('input:checked').length; i++) {\n                result.push($($('.js__answers').find('input:checked')[i]).val());\n            }\n            return result;\n        }\n        return null;\n    }\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/testplayer/helpers/multiple-choice-question.helper.ts?");

/***/ }),

/***/ "./src/ts/testplayer/helpers/sorting-question.helper.ts":
/*!**************************************************************!*\
  !*** ./src/ts/testplayer/helpers/sorting-question.helper.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SortingQuestionHelper\": () => (/* binding */ SortingQuestionHelper)\n/* harmony export */ });\nclass SortingQuestionHelper {\n    constructor(params) {\n        this.params = params;\n    }\n    get questionContent() {\n        return JSON.parse(this.params.question.questionAsJson);\n    }\n    renderQuestion(answerAsJson) {\n        const answers = !answerAsJson ? null : JSON.parse(answerAsJson);\n        this.params.$content.html(`\n            <div style=\"margin: 0px auto;\">\n                <div class=\"js__question\" style=\"margin-bottom: 24px; font-size: 1.5rem; font-weight: 400; line-height: 1.5;\">\n                    ${this.questionContent.question}\n                </div>\n                <div class=\"js__answers\">\n                    ${(answers !== null && answers !== void 0 ? answers : this.questionContent.answers).map(answer => `\n                        <div class=\"js__answer\" \n                            style=\"border: 1px solid #c3c3c3;padding: 8px;border-radius: 4px;margin-bottom:4px;\">\n                            <span class=\"js__answer-content\" style=\"padding: 3px 0px;text-align: justify;\">\n                                ${answer}\n                            </span>\n                        </div>\n                    `).join('')}\n                </div>\n            </div>\n        `);\n        $('.js__answer').click((event) => {\n            const $answerElement = $(event.target);\n            if ($('.js__answer-selected').length) {\n                const $answerSelectedElement = $('.js__answer-selected');\n                const answer = $answerSelectedElement.find('.js__answer-content').html();\n                $answerSelectedElement.find('.js__answer-content').html($answerElement.find('.js__answer-content').html());\n                $answerElement.find('.js__answer-content').html(answer);\n                $answerSelectedElement.removeClass('js__answer-selected');\n                $answerSelectedElement.css('background-color', 'white');\n            }\n            else {\n                $answerElement.addClass('js__answer-selected');\n                $answerElement.css('background-color', '#c3c3c3');\n            }\n        });\n    }\n    getCurrentAnswerFromHtml() {\n        const result = [];\n        this.params.$content.find('.js__answer-content').each((index, answerContentElement) => {\n            result.push($(answerContentElement).html().trim());\n        });\n        return result.sort((a, b) => {\n            if (a < b) {\n                return -1;\n            }\n            if (a > b) {\n                return 1;\n            }\n            return 0;\n        });\n        ;\n    }\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/testplayer/helpers/sorting-question.helper.ts?");

/***/ }),

/***/ "./src/ts/testplayer/index.ts":
/*!************************************!*\
  !*** ./src/ts/testplayer/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_question__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/question */ \"./src/ts/models/question.ts\");\n/* harmony import */ var _helpers_sorting_question_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/sorting-question.helper */ \"./src/ts/testplayer/helpers/sorting-question.helper.ts\");\n/* harmony import */ var _helpers_multiple_choice_question_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/multiple-choice-question.helper */ \"./src/ts/testplayer/helpers/multiple-choice-question.helper.ts\");\n/* harmony import */ var _helpers_blank_filling_question_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/blank-filling-question.helper */ \"./src/ts/testplayer/helpers/blank-filling-question.helper.ts\");\n/* harmony import */ var _helpers_matching_question_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/matching-question.helper */ \"./src/ts/testplayer/helpers/matching-question.helper.ts\");\n\n\n\n\n\nclass TestPlayerController {\n    constructor(params) {\n        this.params = params;\n        this.data = null;\n        this.questionHelper = null;\n        var code = this.getCookie('ACCESS_CODE');\n        if (code) {\n            var codeAsArray = code.split('_');\n            $.ajax({\n                method: 'POST',\n                url: this.params.getPreparedCandidateByCodeUrl,\n                data: {\n                    eventCode: codeAsArray[0],\n                    candidateCode: codeAsArray[1]\n                }\n            }).then((data) => {\n                this.data = data;\n                if (data) {\n                    $('.js__test-name').html(data.test.name);\n                    if (this.isSummary) {\n                        this.renderSummary();\n                    }\n                    else {\n                        this.renderCurrentQuestion();\n                    }\n                }\n            });\n            $('.js__next-question').click((event) => {\n                this.submitCurrentQuestion().then(() => {\n                    location.href = this.getQuestionHerf(this.nextQuestion.questionId);\n                    this.renderCurrentQuestion();\n                });\n            });\n            $('.js__prevent-question').click((event) => {\n                this.submitCurrentQuestion().then(() => {\n                    location.href = this.getQuestionHerf(this.preventQuestion.questionId);\n                    this.renderCurrentQuestion();\n                });\n            });\n            $('.js__summary, .js__test-name').click((event) => {\n                this.submitCurrentQuestion().then(() => {\n                    location.href = location.href.replace(location.hash, '') + '#summary';\n                    this.renderSummary();\n                });\n            });\n        }\n    }\n    get $ContentElement() {\n        return $('.js__container');\n    }\n    get isSummary() {\n        return location.hash.replace('#', '').indexOf('summary') >= 0;\n    }\n    get test() {\n        return this.data.test;\n    }\n    get candidateId() {\n        return this.data.candidateId;\n    }\n    get currentSection() {\n        var currentQuestionId = null;\n        let params = location.hash.replace('#', '').split('&').filter(x => x.startsWith('questionId'));\n        if (params.length)\n            currentQuestionId = params[0].split('=')[1];\n        if (!this.test)\n            return null;\n        if (this.test.sections && this.test.sections.length) {\n            var section = this.test.sections[0];\n            if (currentQuestionId) {\n                for (var i = 0; i < this.test.sections.length; i++) {\n                    var length = this.test.sections[i].questions.filter(x => x.questionId == currentQuestionId).length;\n                    if (length) {\n                        section = this.test.sections[i];\n                    }\n                }\n            }\n            return section;\n        }\n        return null;\n    }\n    get currentQuestion() {\n        var currentQuestionId = null;\n        let params = location.hash.replace('#', '').split('&').filter(x => x.startsWith('questionId'));\n        if (params.length)\n            currentQuestionId = params[0].split('=')[1];\n        if (this.currentSection) {\n            var question = this.currentSection.questions[0];\n            if (this.currentSection.questions && this.currentSection.questions.length) {\n                if (currentQuestionId) {\n                    question = this.currentSection.questions.filter(x => x.questionId == currentQuestionId)[0];\n                }\n            }\n            return question;\n        }\n        return null;\n    }\n    get nextQuestion() {\n        let questions = this.currentSection.questions;\n        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);\n        if (index < questions.length - 1) {\n            return questions[index + 1];\n        }\n        return null;\n    }\n    get preventQuestion() {\n        let questions = this.currentSection.questions;\n        let index = questions.findIndex(x => x.questionId == this.currentQuestion.questionId);\n        if (index > 0) {\n            return questions[index - 1];\n        }\n        return null;\n    }\n    renderCurrentQuestion() {\n        let currentQuestion = this.currentQuestion;\n        if (this.preventQuestion) {\n            $('.js__prevent-question').show();\n        }\n        else {\n            $('.js__prevent-question').hide();\n        }\n        if (this.nextQuestion) {\n            $('.js__summary').hide();\n            $('.js__next-question').show();\n        }\n        else {\n            $('.js__next-question').hide();\n            $('.js__summary').show();\n        }\n        switch (currentQuestion.type) {\n            case _models_question__WEBPACK_IMPORTED_MODULE_0__.QuestionType.MultipleChoiceQuestion: {\n                this.questionHelper = new _helpers_multiple_choice_question_helper__WEBPACK_IMPORTED_MODULE_2__.MultipleChoiceQuestionHelper({\n                    question: currentQuestion,\n                    $content: $('.js__container')\n                });\n                break;\n            }\n            case _models_question__WEBPACK_IMPORTED_MODULE_0__.QuestionType.BlankFillingQuestion: {\n                this.questionHelper = new _helpers_blank_filling_question_helper__WEBPACK_IMPORTED_MODULE_3__.BlankFillingQuestionHelper({\n                    question: currentQuestion,\n                    $content: $('.js__container')\n                });\n                break;\n            }\n            case _models_question__WEBPACK_IMPORTED_MODULE_0__.QuestionType.MatchingQuestion: {\n                this.questionHelper = new _helpers_matching_question_helper__WEBPACK_IMPORTED_MODULE_4__.MatchingQuestionHelper({\n                    question: currentQuestion,\n                    $content: $('.js__container')\n                });\n                break;\n            }\n            case _models_question__WEBPACK_IMPORTED_MODULE_0__.QuestionType.SortingQuestion: {\n                this.questionHelper = new _helpers_sorting_question_helper__WEBPACK_IMPORTED_MODULE_1__.SortingQuestionHelper({\n                    question: currentQuestion,\n                    $content: $('.js__container')\n                });\n                break;\n            }\n        }\n        this.getCurrentAnswerFromServer().then(answerAsJson => {\n            if (currentQuestion.media) {\n                $('.js__media').html(`\n                <audio controls>\n                  <source src=\"${currentQuestion.media}\" type=\"audio/mpeg\">\n                Your browser does not support the audio element.\n                </audio>\n            `);\n            }\n            this.questionHelper.renderQuestion(answerAsJson);\n        });\n    }\n    getCurrentAnswerFromServer() {\n        return new Promise((resolve, reject) => {\n            $.ajax({\n                method: 'GET',\n                url: this.params.getAnswerUrl,\n                data: {\n                    candidateId: this.candidateId,\n                    questionId: this.currentQuestion.questionId\n                }\n            }).then(answer => {\n                resolve(answer);\n            });\n        });\n    }\n    submitCurrentQuestion() {\n        return new Promise((resolve, reject) => {\n            let answer = this.getCurrentAnswerAsJson();\n            if (answer) {\n                return $.ajax({\n                    method: 'POST',\n                    url: this.params.submitQuestionUrl,\n                    data: {\n                        candidateId: this.candidateId,\n                        questionId: this.currentQuestion.questionId,\n                        answerAsJson: answer\n                    }\n                }).then(() => {\n                    resolve();\n                });\n            }\n            else {\n                resolve();\n            }\n        });\n    }\n    getCurrentAnswerAsJson() {\n        var answer = this.questionHelper.getCurrentAnswerFromHtml();\n        if (answer) {\n            return JSON.stringify(answer);\n        }\n        else {\n            return '';\n        }\n    }\n    renderSummary() {\n        $('.js__prevent-question').hide();\n        $('.js__next-question').hide();\n        $('.js__summary').hide();\n        $.ajax({\n            method: 'GET',\n            url: this.params.getAnswersUrl,\n            data: {\n                candidateId: this.candidateId\n            }\n        }).then((answers) => {\n            var html = '';\n            this.test.sections.forEach(section => {\n                var questionsAsHtml = '';\n                section.questions.forEach((question, index) => {\n                    let backgroundColor = '';\n                    let answer = answers.find(x => x.questionId == question.questionId);\n                    if (answer) {\n                        backgroundColor = 'background: #adb5bd';\n                    }\n                    else {\n                        backgroundColor = '';\n                    }\n                    questionsAsHtml += `<a class=\"js__go-to-question\" data-question-id=\"${question.questionId}\" style=\"padding: 8px 8px;box-sizing: content-box;display: inline-block;width: 24px;text-align: center;${backgroundColor};border: solid 1px #adb5bd;border-radius: 50%;margin: 5px; cursor: pointer;\">${index + 1}</a>`;\n                });\n                html += `\n                    <div>\n                        <div>\n                            <h3>Section 1</h3>\n                        </div>\n                        <div>\n                            ${questionsAsHtml}\n                        </div>\n                    </div>\n                    <div style=\"text-align: center\">\n                        <a class=\"btn btn-light js__mark-question\" style=\"cursor: pointer\">Mark</a>\n                        <a class=\"btn btn-light js__submit\" style=\"cursor: pointer\">Submit</a>\n                        <a class=\"btn btn-light js__clear\" style=\"cursor: pointer\">Clear</a>\n                    </div>`;\n            });\n            this.$ContentElement.html(html);\n            $('.js__go-to-question').click((event) => {\n                let questionId = $(event.target).data('question-id');\n                location.href = this.getQuestionHerf(questionId);\n                this.renderCurrentQuestion();\n            });\n            $('.js__mark-question').click((event) => {\n                this.mark();\n            });\n            $('.js__submit').click((event) => {\n                $.ajax({\n                    method: 'POST',\n                    url: this.params.submitUrl,\n                    data: {\n                        candidateId: this.candidateId\n                    }\n                }).then(() => {\n                    location.href = this.params.homeUrl;\n                });\n            });\n            $('.js__clear').click((event) => {\n                $.ajax({\n                    method: 'POST',\n                    url: this.params.clearUrl,\n                    data: {\n                        candidateId: this.candidateId\n                    }\n                }).then(() => {\n                    let url = new URL(location.href);\n                    location.href = url.href.replace(url.hash, '');\n                });\n            });\n        });\n    }\n    mark() {\n        $.ajax({\n            method: 'GET',\n            url: this.params.getCorrectAnswersUrl,\n            data: {\n                testId: this.test.testId\n            }\n        }).then((correctAnswers) => {\n            $.ajax({\n                method: 'GET',\n                url: this.params.getAnswersUrl,\n                data: {\n                    candidateId: this.candidateId\n                }\n            }).then((answers) => {\n                let result = [];\n                answers.forEach(answer => {\n                    correctAnswers.forEach(correctAnswer => {\n                        if (answer.questionId == correctAnswer.questionId) {\n                            if (answer.answerAsJson == correctAnswer.answerAsJson) {\n                                result.push({\n                                    questionId: answer.questionId,\n                                    isCorrect: true\n                                });\n                            }\n                            else {\n                                result.push({\n                                    questionId: answer.questionId,\n                                    isCorrect: false\n                                });\n                            }\n                        }\n                    });\n                });\n                $('.js__go-to-question').each((index, element) => {\n                    let questionId = $(element).data('question-id');\n                    let resultItem = result.find(x => x.questionId == questionId);\n                    if (resultItem) {\n                        if (!resultItem.isCorrect) {\n                            $(element).css('background', '#dc3545');\n                        }\n                        else {\n                            $(element).css('background', '#28a745');\n                        }\n                    }\n                });\n            });\n        });\n    }\n    getQuestionHerf(questionId) {\n        return location.href.replace(location.hash, '') + '#questionId=' + questionId;\n    }\n    getCookie(cname) {\n        let name = cname + \"=\";\n        let decodedCookie = decodeURIComponent(document.cookie);\n        let ca = decodedCookie.split(';');\n        for (let i = 0; i < ca.length; i++) {\n            let c = ca[i];\n            while (c.charAt(0) == ' ') {\n                c = c.substring(1);\n            }\n            if (c.indexOf(name) == 0) {\n                return c.substring(name.length, c.length);\n            }\n        }\n        return \"\";\n    }\n}\nif ($('[test-player-params]')) {\n    let paramsAsJson = $('[test-player-params]').attr('test-player-params');\n    let params = JSON.parse(paramsAsJson);\n    new TestPlayerController(params);\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/testplayer/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ts/testplayer/index.ts");
/******/ 	
/******/ })()
;