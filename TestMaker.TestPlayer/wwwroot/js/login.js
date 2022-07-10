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

/***/ "./src/ts/login/index.ts":
/*!*******************************!*\
  !*** ./src/ts/login/index.ts ***!
  \*******************************/
/***/ (() => {

eval("class LoginController {\r\n    constructor(params) {\r\n        this.params = params;\r\n        $('.js__login').click((event) => {\r\n            var userName = $('.js__user-name').val().toString();\r\n            var password = $('.js__password').val().toString();\r\n            $.ajax({\r\n                method: 'POST',\r\n                url: params.loginUrl,\r\n                data: {\r\n                    userName: userName,\r\n                    password: password\r\n                }\r\n            }).then((token) => {\r\n                if (token) {\r\n                    this.setCookie('accessToken', token.accessToken, token.expiresIn);\r\n                    location.href = `${location.origin}${this.params.homeUrl}`;\r\n                }\r\n            });\r\n        });\r\n    }\r\n    setCookie(cname, cvalue, exdays) {\r\n        const d = new Date();\r\n        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\r\n        let expires = \"expires=\" + d.toUTCString();\r\n        document.cookie = cname + \"=\" + cvalue + \";\" + expires + \";path=/\";\r\n    }\r\n}\r\nif ($('[login-params]')) {\r\n    let paramsAsJson = $('[login-params]').attr('login-params');\r\n    let params = JSON.parse(paramsAsJson);\r\n    new LoginController(params);\r\n}\r\n\n\n//# sourceURL=webpack://asp.net/./src/ts/login/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/ts/login/index.ts"]();
/******/ 	
/******/ })()
;