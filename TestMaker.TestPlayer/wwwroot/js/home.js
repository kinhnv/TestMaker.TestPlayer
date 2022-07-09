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

eval("class HomeController {\n    constructor(params) {\n        this.params = params;\n        $('.js__do-test').click((event) => {\n            var eventCode = $('.js__event-code').val().toString();\n            var candidateCode = $('.js__candidate-code').val().toString();\n            this.setCookie('ACCESS_CODE', eventCode + '_' + candidateCode, 1);\n            location.href = `${location.origin}${this.params.testPlayerUrl}`;\n        });\n    }\n    setCookie(cname, cvalue, exdays) {\n        const d = new Date();\n        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\n        let expires = \"expires=\" + d.toUTCString();\n        document.cookie = cname + \"=\" + cvalue + \";\" + expires + \";path=/\";\n    }\n}\nif ($('[home-params]')) {\n    let paramsAsJson = $('[home-params]').attr('home-params');\n    let params = JSON.parse(paramsAsJson);\n    new HomeController(params);\n}\n\n\n//# sourceURL=webpack://asp.net/./src/ts/home/index.ts?");

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