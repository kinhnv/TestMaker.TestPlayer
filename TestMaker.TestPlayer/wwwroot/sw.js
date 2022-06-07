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

/***/ "./src/sw.ts":
/*!*******************!*\
  !*** ./src/sw.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ts_requesthandler_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/requesthandler/index */ \"./src/ts/requesthandler/index.ts\");\n/// <reference no-default-lib=\"false\"/>\r\n/// <reference lib=\"ES2015\" />\r\n/// <reference lib=\"webworker\" />\r\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\nlet VERSION = 1;\r\nlet CACHE_NAME = `CACHE_NAME_V${VERSION}`;\r\nself.addEventListener('install', (event) => __awaiter(void 0, void 0, void 0, function* () {\r\n    let cache = yield caches.open(CACHE_NAME);\r\n    cache.addAll([\r\n        \"./lib/bootstrap/dist/css/bootstrap.min.css\",\r\n        \"./css/site.css\",\r\n        \"./lib/jquery/dist/jquery.min.js\",\r\n        \"./lib/bootstrap/dist/js/bootstrap.bundle.min.js\",\r\n        \"./favicon.ico\",\r\n        \"/\",\r\n        \"./js/home.js\",\r\n        \"/TestPlayer\",\r\n        \"./js/testplayer.js\",\r\n        \"/Events\",\r\n        \"./js/events.js\",\r\n    ]);\r\n}));\r\nself.addEventListener('fetch', (event) => __awaiter(void 0, void 0, void 0, function* () {\r\n    function handleRequest() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            let requestClone = event.request.clone();\r\n            let cache = yield caches.open(CACHE_NAME);\r\n            let response = yield (new _ts_requesthandler_index__WEBPACK_IMPORTED_MODULE_0__.RequestHandler({\r\n                isOnline: navigator.onLine,\r\n                version: VERSION,\r\n                requestClone: requestClone,\r\n                cache: cache\r\n            }).handleAsync());\r\n            if (response) {\r\n                return response;\r\n            }\r\n            else {\r\n                if (!navigator.onLine) {\r\n                    return yield cache.match(requestClone);\r\n                }\r\n                else {\r\n                    return yield fetch(requestClone);\r\n                }\r\n            }\r\n        });\r\n    }\r\n    event.respondWith(handleRequest());\r\n}));\r\n\n\n//# sourceURL=webpack://asp.net/./src/sw.ts?");

/***/ }),

/***/ "./src/ts/requesthandler/index.ts":
/*!****************************************!*\
  !*** ./src/ts/requesthandler/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RequestHandler\": () => (/* binding */ RequestHandler)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nclass RequestHandler {\r\n    constructor(params) {\r\n        this.params = params;\r\n        this.DB_NAME = 'TestPlayer';\r\n        this.CANDIDATES_TABLE = 'Candidates';\r\n        this.CANDIDATE_ANSWER_TABLE = 'CandidateAnswers';\r\n    }\r\n    get url() {\r\n        return this.params.requestClone.url;\r\n    }\r\n    get path() {\r\n        return (new URL(this.url)).pathname;\r\n    }\r\n    get isPost() {\r\n        return this.params.requestClone.method == 'POST';\r\n    }\r\n    handleAsync() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (this.params.isOnline) {\r\n                switch (this.path) {\r\n                    case '/Events/GetPublicEventsAndCandidates':\r\n                        if (!this.isPost) {\r\n                            let response = yield fetch(this.params.requestClone);\r\n                            let data = yield response.clone().json();\r\n                            let dataFromIndexdDB = yield this.getAllObjectAsync(this.CANDIDATES_TABLE);\r\n                            dataFromIndexdDB.forEach(itemFromIndexdDB => {\r\n                                let items = data.filter(i => i.eventCode == itemFromIndexdDB.data.eventCode && i.candidateCode == itemFromIndexdDB.data.candidateCode);\r\n                                if (items.length == 1) {\r\n                                    items[0].test = itemFromIndexdDB.data.test;\r\n                                }\r\n                                else {\r\n                                    data.push(itemFromIndexdDB.data);\r\n                                }\r\n                            });\r\n                            return new Response(JSON.stringify(data), {\r\n                                headers: { 'Content-Type': 'application/json' }\r\n                            });\r\n                        }\r\n                        return null;\r\n                    case '/TestPlayer/Events/Prepare':\r\n                        if (this.isPost) {\r\n                            let response = yield fetch(this.params.requestClone);\r\n                            let data = yield response.clone().json();\r\n                            if (data) {\r\n                                this.addOrPutObjectAsync(this.CANDIDATES_TABLE, {\r\n                                    key: `${data.eventCode}_${data.candidateCode}`,\r\n                                    data: data,\r\n                                    LastUpdate: new Date()\r\n                                });\r\n                            }\r\n                            return response;\r\n                        }\r\n                        return null;\r\n                    case '/TestPlayer/SubmitQuestion':\r\n                        if (this.isPost) {\r\n                            let candidateAnswer = yield this.params.requestClone.clone().formData();\r\n                            yield this.addOrPutObjectAsync(this.CANDIDATE_ANSWER_TABLE, {\r\n                                key: `${candidateAnswer.get('candidateId').toString()}_${candidateAnswer.get('questionId').toString()}`,\r\n                                data: {\r\n                                    candidateId: candidateAnswer.get('candidateId').toString(),\r\n                                    questionId: candidateAnswer.get('questionId').toString(),\r\n                                    answerAsJson: candidateAnswer.get('answerAsJson').toString()\r\n                                },\r\n                                LastUpdate: new Date()\r\n                            });\r\n                            return yield fetch(this.params.requestClone);\r\n                        }\r\n                        else {\r\n                            return null;\r\n                        }\r\n                    default:\r\n                        return null;\r\n                }\r\n                ;\r\n            }\r\n            else {\r\n                switch (this.path) {\r\n                    case '/TestPlayer/GetPreparedCandidateByCode':\r\n                        let text = yield this.params.requestClone.text();\r\n                        let eventCode = text.split('&')[0].split('=')[1];\r\n                        let candidateCode = text.split('&')[1].split('=')[1];\r\n                        let data = yield this.getObjectAsync(this.CANDIDATES_TABLE, `${eventCode}_${candidateCode}`);\r\n                        return new Response(JSON.stringify(data.data), {\r\n                            headers: { 'Content-Type': 'application/json' }\r\n                        });\r\n                    case '/Events/GetPublicEventsAndCandidates':\r\n                        if (!this.isPost) {\r\n                            let dataFromIndexdDB = yield this.getAllObjectAsync(this.CANDIDATES_TABLE);\r\n                            return new Response(JSON.stringify(dataFromIndexdDB.map(i => i.data)), {\r\n                                headers: { 'Content-Type': 'application/json' }\r\n                            });\r\n                        }\r\n                        return null;\r\n                    case '/TestPlayer/SubmitQuestion':\r\n                        if (this.isPost) {\r\n                            let candidateAnswer = yield this.params.requestClone.formData();\r\n                            let candidateId = candidateAnswer.get('candidateId').toString();\r\n                            let questionId = candidateAnswer.get('questionId').toString();\r\n                            let answerAsJson = candidateAnswer.get('answerAsJson').toString();\r\n                            var answers = yield this.getObjectAsync(this.CANDIDATE_ANSWER_TABLE, candidateId);\r\n                            if (answers) {\r\n                                let answer = answers.data.filter(x => x.questionId == questionId);\r\n                                if (answer.length == 0) {\r\n                                    answers.data.push({\r\n                                        questionId: questionId,\r\n                                        answerAsJson: answerAsJson\r\n                                    });\r\n                                }\r\n                                else {\r\n                                    answer[0].answerAsJson = answerAsJson;\r\n                                }\r\n                            }\r\n                            else {\r\n                                answers = {\r\n                                    key: candidateId,\r\n                                    data: [{\r\n                                            questionId: questionId,\r\n                                            answerAsJson: answerAsJson\r\n                                        }],\r\n                                    LastUpdate: new Date()\r\n                                };\r\n                            }\r\n                            yield this.addOrPutObjectAsync(this.CANDIDATE_ANSWER_TABLE, answers);\r\n                            return new Response(JSON.stringify(null), {\r\n                                headers: { 'Content-Type': 'application/json' }\r\n                            });\r\n                        }\r\n                        else {\r\n                            return null;\r\n                        }\r\n                    case '/TestPlayer/GetAnswer':\r\n                        if (this.isPost) {\r\n                            return null;\r\n                        }\r\n                        else {\r\n                            let url = new URL(this.params.requestClone.clone().url);\r\n                            let candidateId = url.searchParams.get('candidateId');\r\n                            let questionId = url.searchParams.get('questionId');\r\n                            let data = yield this.getObjectAsync(this.CANDIDATE_ANSWER_TABLE, candidateId);\r\n                            if (data) {\r\n                                let answerAsJson = data.data.filter(x => x.questionId == questionId);\r\n                                if (answerAsJson.length == 1) {\r\n                                    return new Response(JSON.stringify(answerAsJson[0].answerAsJson), {\r\n                                        headers: { 'Content-Type': 'application/json' }\r\n                                    });\r\n                                }\r\n                                else {\r\n                                    return new Response(JSON.stringify(null), {\r\n                                        headers: { 'Content-Type': 'application/json' }\r\n                                    });\r\n                                }\r\n                            }\r\n                            else {\r\n                                return new Response(JSON.stringify(null), {\r\n                                    headers: { 'Content-Type': 'application/json' }\r\n                                });\r\n                            }\r\n                        }\r\n                    case '/TestPlayer/GetAnswers':\r\n                        if (this.isPost) {\r\n                            return null;\r\n                        }\r\n                        else {\r\n                            let url = new URL(this.params.requestClone.clone().url);\r\n                            let candidateId = url.searchParams.get('candidateId');\r\n                            let indexedDBObject = yield this.getObjectAsync(this.CANDIDATE_ANSWER_TABLE, candidateId);\r\n                            if (indexedDBObject) {\r\n                                return new Response(JSON.stringify(indexedDBObject.data.map(indexedDBObject => {\r\n                                    return {\r\n                                        candidateId: candidateId,\r\n                                        questionId: indexedDBObject.questionId,\r\n                                        answerAsJson: indexedDBObject.answerAsJson\r\n                                    };\r\n                                })), {\r\n                                    headers: { 'Content-Type': 'application/json' }\r\n                                });\r\n                            }\r\n                            else {\r\n                                return new Response(JSON.stringify(null), {\r\n                                    headers: { 'Content-Type': 'application/json' }\r\n                                });\r\n                            }\r\n                        }\r\n                    default:\r\n                        return null;\r\n                }\r\n                ;\r\n            }\r\n        });\r\n    }\r\n    openIndexdDBAsync() {\r\n        return new Promise((resolve, error) => {\r\n            var request = indexedDB.open(this.DB_NAME, this.params.version);\r\n            request.onerror = function (message) {\r\n                error(message);\r\n            };\r\n            request.onupgradeneeded = function (event) {\r\n                let database = event.target.result;\r\n                database.createObjectStore(\"Candidates\", { keyPath: \"key\" });\r\n                database.createObjectStore(\"CandidateAnswers\", { keyPath: \"key\" });\r\n            };\r\n            request.onsuccess = function (event) {\r\n                resolve(event.target.result);\r\n            };\r\n        });\r\n    }\r\n    addOrPutObjectAsync(tableName, object) {\r\n        return new Promise((resolve, reject) => {\r\n            this.openIndexdDBAsync().then(database => {\r\n                let transaction = database.transaction(tableName, \"readwrite\");\r\n                let objectStore = transaction.objectStore(tableName);\r\n                objectStore.get(object.key).onsuccess = (getEvent) => {\r\n                    var savedObject = getEvent.target.result;\r\n                    if (savedObject) {\r\n                        objectStore.put(object).onsuccess = () => {\r\n                            resolve(object);\r\n                        };\r\n                    }\r\n                    else {\r\n                        objectStore.add(object).onsuccess = () => {\r\n                            resolve(object);\r\n                        };\r\n                    }\r\n                };\r\n            });\r\n        });\r\n    }\r\n    getObjectAsync(tableName, key) {\r\n        return new Promise((resolve, reject) => {\r\n            this.openIndexdDBAsync().then(database => {\r\n                let transaction = database.transaction(tableName, \"readonly\");\r\n                transaction.objectStore(tableName).get(key).onsuccess = (event) => {\r\n                    resolve(event.target.result);\r\n                };\r\n            });\r\n        });\r\n    }\r\n    getAllObjectAsync(tableName, index, query, count) {\r\n        return new Promise(resolve => {\r\n            this.openIndexdDBAsync().then(database => {\r\n                let transaction = database.transaction(tableName, \"readonly\");\r\n                if (index) {\r\n                    transaction.objectStore(tableName).getAll(query, count).onsuccess = (event) => {\r\n                        resolve(event.target.result);\r\n                    };\r\n                }\r\n                else {\r\n                    transaction.objectStore(tableName).getAll(query, count).onsuccess = (event) => {\r\n                        resolve(event.target.result);\r\n                    };\r\n                }\r\n            });\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://asp.net/./src/ts/requesthandler/index.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/sw.ts");
/******/ 	
/******/ })()
;