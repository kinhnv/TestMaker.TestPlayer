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

/***/ "./src/ts/events/index.ts":
/*!********************************!*\
  !*** ./src/ts/events/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nclass EventsController {\n    constructor(params) {\n        this.params = params;\n        this.renderList();\n        $('.js__prepare').click((event) => {\n            var eventCode = $('.js__prepare-event-code-input').val();\n            var candidateCode = $('.js__prepare-candidate-code-input').val();\n            $.ajax({\n                method: 'POST',\n                url: this.params.prepareUrl,\n                data: {\n                    eventCode: eventCode,\n                    candidateCode: candidateCode\n                }\n            }).then(candidate => {\n                this.renderList();\n            });\n        });\n        window.addEventListener('online', () => {\n            this.renderList();\n        });\n        window.addEventListener('offline', () => {\n            this.renderList();\n        });\n    }\n    renderList() {\n        return $.ajax({\n            method: 'GET',\n            url: this.params.getPublicEventsAndCandidatesUrl\n        }).then((prepareDataList) => {\n            $('.js__event').remove();\n            function createCandidateUI(prepareData) {\n                let isInServer = prepareData.test == null;\n                return `<span class=\"js__candidate js__candidate-${prepareData.candidateCode}\" data-candidate-code=\"${prepareData.candidateCode}\">\n                            ${prepareData.candidateCode} (${isInServer ? 'Server' : 'Client'}) - \n                            <a class=\"btn btn-outline-primary btn-sm js__join-event\" style=\"cursor: pointer\"\n                                data-event-code=\"${prepareData.eventCode}\" data-candidate-code=\"${prepareData.candidateCode}\">\n                                Tham gia\n                            </a>\n                            ${isInServer && navigator.onLine ? `<!-- - \n                                <a class=\"btn btn-outline-primary btn-sm js__prepare-candidate\"\n                                    data-event-code=\"${prepareData.eventCode}\" \n                                    data-candidate-code=\"${prepareData.candidateCode}\" \n                                    style=\"cursor: pointer\">\n                                    Tải\n                                </a>-->` : ''}\n                        </span>`;\n            }\n            prepareDataList.forEach(prepareData => {\n                let isPublic = prepareData.eventType == 1;\n                let hasCandidate = !!prepareData.candidateCode;\n                if ($(`.js__event-${prepareData.eventCode}`).length) {\n                    $(`.js__event-${prepareData.eventCode}`).find('.js__candidates').append(`,${createCandidateUI(prepareData)}`);\n                }\n                else {\n                    $('.js__events').append(`\n                        <tr class=\"js__event js__event-${prepareData.eventCode}\" data-event-code=\"${prepareData.eventCode}\">\n                            <td style=\"text-align: left; width: 200px; line-height: 30px\">\n                                ${prepareData.eventCode} (${isPublic ? 'Public' : 'Private'})\n                            </td>\n                            <td style=\"text-align: left;\">\n                                ${hasCandidate ? `<span class=\"js__candidates\">\n                                    ${createCandidateUI(prepareData)}\n                                </span>,` : ``}\n                                <a class=\"btn btn-outline-primary btn-sm js__create-candidate\"\n                                    data-event-id=\"${prepareData.eventId}\"\n                                    style=\"cursor: pointer\">\n                                    Tạo thi sinh mới\n                                </a>\n                            </td>\n                        </tr>\n                    `);\n                }\n            });\n            this.addEventToJoinEventButton();\n        });\n    }\n    addEventToJoinEventButton() {\n        $('.js__join-event').click((event) => {\n            let eventCode = $(event.target).data('event-code');\n            let candidateCode = $(event.target).data('candidate-code');\n            this.setCookie('ACCESS_CODE', eventCode + '_' + candidateCode, 1);\n            location.href = `${location.origin}${this.params.testPlayerUrl}`;\n        });\n        $('.js__prepare-candidate').click((event) => {\n            let eventCode = $(event.target).data('event-code');\n            let candidateCode = $(event.target).data('candidate-code');\n            $.ajax({\n                method: 'POST',\n                url: this.params.prepareUrl,\n                data: {\n                    eventCode: eventCode,\n                    candidateCode: candidateCode\n                }\n            }).then(() => {\n                this.renderList();\n            });\n        });\n        $('.js__create-candidate').click((event) => {\n            let eventId = $(event.target).data('event-id');\n            $.ajax({\n                method: 'POST',\n                url: `${this.params.createCandidateUrl}?eventId=${eventId}`\n            }).then(() => {\n                this.renderList();\n            });\n        });\n    }\n    setCookie(cname, cvalue, exdays) {\n        const d = new Date();\n        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\n        let expires = \"expires=\" + d.toUTCString();\n        document.cookie = cname + \"=\" + cvalue + \";\" + expires + \";path=/\";\n    }\n}\nif ($('[events-params]')) {\n    let paramsAsJson = $('[events-params]').attr('events-params');\n    let params = JSON.parse(paramsAsJson);\n    new EventsController(params);\n}\n\n\n\n//# sourceURL=webpack://asp.net/./src/ts/events/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/ts/events/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;