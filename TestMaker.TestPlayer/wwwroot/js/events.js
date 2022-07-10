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

eval("__webpack_require__.r(__webpack_exports__);\nclass EventsController {\r\n    constructor(params) {\r\n        this.params = params;\r\n        this.renderList();\r\n        $('.js__prepare').click((event) => {\r\n            var eventCode = $('.js__prepare-event-code-input').val();\r\n            var candidateCode = $('.js__prepare-candidate-code-input').val();\r\n            $.ajax({\r\n                method: 'POST',\r\n                url: this.params.prepareUrl,\r\n                data: {\r\n                    eventCode: eventCode,\r\n                    candidateCode: candidateCode\r\n                }\r\n            }).then(candidate => {\r\n                this.renderList();\r\n            });\r\n        });\r\n        window.addEventListener('online', () => {\r\n            this.renderList();\r\n        });\r\n        window.addEventListener('offline', () => {\r\n            this.renderList();\r\n        });\r\n    }\r\n    renderList() {\r\n        return $.ajax({\r\n            method: 'GET',\r\n            url: this.params.getPublicEventsAndCandidatesUrl\r\n        }).then((prepareDataList) => {\r\n            $('.js__event').remove();\r\n            function createCandidateUI(prepareData) {\r\n                let isInServer = prepareData.test == null;\r\n                return `<span class=\"js__candidate js__candidate-${prepareData.candidateCode}\" data-candidate-code=\"${prepareData.candidateCode}\">\r\n                            ${prepareData.candidateCode} (${isInServer ? 'Server' : 'Client'}) - \r\n                            <a class=\"btn btn-outline-primary btn-sm js__join-event\" style=\"cursor: pointer\"\r\n                                data-event-code=\"${prepareData.eventCode}\" data-candidate-code=\"${prepareData.candidateCode}\">\r\n                                Tham gia\r\n                            </a>\r\n                            ${isInServer && navigator.onLine ? `<!-- - \r\n                                <a class=\"btn btn-outline-primary btn-sm js__prepare-candidate\"\r\n                                    data-event-code=\"${prepareData.eventCode}\" \r\n                                    data-candidate-code=\"${prepareData.candidateCode}\" \r\n                                    style=\"cursor: pointer\">\r\n                                    Tải\r\n                                </a>-->` : ''}\r\n                        </span>`;\r\n            }\r\n            prepareDataList.forEach(prepareData => {\r\n                let isPublic = prepareData.eventScopeType == 1;\r\n                let hasCandidate = !!prepareData.candidateCode;\r\n                if ($(`.js__event-${prepareData.eventCode}`).length) {\r\n                    $(`.js__event-${prepareData.eventCode}`).find('.js__candidates').append(`,${createCandidateUI(prepareData)}`);\r\n                }\r\n                else {\r\n                    $('.js__events').append(`\r\n                        <tr class=\"js__event js__event-${prepareData.eventCode}\" data-event-code=\"${prepareData.eventCode}\">\r\n                            <td style=\"text-align: left; width: 200px; line-height: 30px\">\r\n                                ${isPublic ? prepareData.eventName : prepareData.eventCode} (${isPublic ? 'Public' : 'Private'})\r\n                            </td>\r\n                            <td style=\"text-align: left;\">\r\n                                ${hasCandidate ? `<span class=\"js__candidates\">\r\n                                    ${createCandidateUI(prepareData)}\r\n                                </span>,` : ``}\r\n                                <a class=\"btn btn-outline-primary btn-sm js__create-candidate\"\r\n                                    data-event-id=\"${prepareData.eventId}\"\r\n                                    style=\"cursor: pointer\">\r\n                                    Tạo thi sinh mới\r\n                                </a>\r\n                            </td>\r\n                        </tr>\r\n                    `);\r\n                }\r\n            });\r\n            this.addEventToJoinEventButton();\r\n        });\r\n    }\r\n    addEventToJoinEventButton() {\r\n        $('.js__join-event').click((event) => {\r\n            let eventCode = $(event.target).data('event-code');\r\n            let candidateCode = $(event.target).data('candidate-code');\r\n            this.setCookie('ACCESS_CODE', eventCode + '_' + candidateCode, 1);\r\n            location.href = `${location.origin}${this.params.testPlayerUrl}`;\r\n        });\r\n        $('.js__prepare-candidate').click((event) => {\r\n            let eventCode = $(event.target).data('event-code');\r\n            let candidateCode = $(event.target).data('candidate-code');\r\n            $.ajax({\r\n                method: 'POST',\r\n                url: this.params.prepareUrl,\r\n                data: {\r\n                    eventCode: eventCode,\r\n                    candidateCode: candidateCode\r\n                }\r\n            }).then(() => {\r\n                this.renderList();\r\n            });\r\n        });\r\n        $('.js__create-candidate').click((event) => {\r\n            let eventId = $(event.target).data('event-id');\r\n            $.ajax({\r\n                method: 'POST',\r\n                url: `${this.params.createCandidateUrl}?eventId=${eventId}`\r\n            }).then(() => {\r\n                this.renderList();\r\n            });\r\n        });\r\n    }\r\n    setCookie(cname, cvalue, exdays) {\r\n        const d = new Date();\r\n        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\r\n        let expires = \"expires=\" + d.toUTCString();\r\n        document.cookie = cname + \"=\" + cvalue + \";\" + expires + \";path=/\";\r\n    }\r\n}\r\nif ($('[events-params]')) {\r\n    let paramsAsJson = $('[events-params]').attr('events-params');\r\n    let params = JSON.parse(paramsAsJson);\r\n    new EventsController(params);\r\n}\r\n\r\n\n\n//# sourceURL=webpack://asp.net/./src/ts/events/index.ts?");

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