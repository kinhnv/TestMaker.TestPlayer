/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/home/index.ts":
/*!******************************!*\
  !*** ./src/ts/home/index.ts ***!
  \******************************/
/***/ (() => {

eval("class HomeController {\r\n    constructor(params) {\r\n        this.params = params;\r\n        $('.js__do-test').click((event) => {\r\n            var eventCode = $('.js__event-code').val().toString();\r\n            var candidateCode = $('.js__candidate-code').val().toString();\r\n            this.setCookie('ACCESS_CODE', eventCode + '_' + candidateCode, 1);\r\n            location.href = `${location.origin}${this.params.testPlayerUrl}`;\r\n        });\r\n    }\r\n    setCookie(cname, cvalue, exdays) {\r\n        const d = new Date();\r\n        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\r\n        let expires = \"expires=\" + d.toUTCString();\r\n        document.cookie = cname + \"=\" + cvalue + \";\" + expires + \";path=/\";\r\n    }\r\n}\r\nif ($('[home-params]')) {\r\n    let paramsAsJson = $('[home-params]').attr('home-params');\r\n    let params = JSON.parse(paramsAsJson);\r\n    new HomeController(params);\r\n}\r\n\n\n//# sourceURL=webpack://asp.net/./src/ts/home/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/ts/home/index.ts"]();
/******/ 	
/******/ })()
;