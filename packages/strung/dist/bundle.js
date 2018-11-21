(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["strung"] = factory();
	else
		root["strung"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Strungifier.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/HuffManEncoder.ts":
/*!*******************************!*\
  !*** ./src/HuffManEncoder.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _binaryStringCompressor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./binaryStringCompressor */ \"./src/binaryStringCompressor.ts\");\n\nclass HuffManNode {\n    constructor(char, freq) {\n        this.char = char;\n        this.freq = freq;\n        this.left = null;\n        this.right = null;\n    }\n    buildPath(pattern) {\n        if (this.left && pattern.test(this.left.char)) {\n            return '0' + this.left.buildPath(pattern);\n        }\n        else if (this.right && pattern.test(this.right.char)) {\n            return '1' + this.right.buildPath(pattern);\n        }\n        else {\n            console.assert(this.char.length === 1, [\n                'Didn\\'t find node!',\n                this.left && `left is: ${this.left.char}`,\n                this.right && `right is: ${this.right.char}`,\n                `looking for: ${pattern}`\n            ].join(', '));\n            return '';\n        }\n    }\n    static combine(nodeA, nodeB) {\n        const parent = new HuffManNode(nodeA.char + nodeB.char, nodeA.freq + nodeB.freq);\n        parent.left = nodeA;\n        parent.right = nodeB;\n        return parent;\n    }\n    toString() {\n        let string = '';\n        if (this.left) {\n            string += this.left.toString();\n        }\n        if (this.char.length === 1) {\n            string += this.char;\n        }\n        if (this.right) {\n            string += this.right.toString();\n        }\n        return string;\n    }\n}\nclass HuffManEncoder {\n    constructor(text, options = {}) {\n        Object.assign.call(this, {\n            log: console.log,\n            decoderSigniture: '$$$$',\n        }, options);\n        this.mapCharToFreq = text.split('')\n            .reduce((acc, char) => {\n            acc[char] = (acc[char] || 0) + 1;\n            return acc;\n        }, {});\n        const nodes = Object.entries(this.mapCharToFreq)\n            .map(([key, value]) => new HuffManNode(key, value));\n        this.root = this.build(nodes);\n    }\n    static decoderCallLength() {\n        return 4;\n    }\n    getMostCommonChar() {\n        return Object.entries(this.mapCharToFreq)\n            .reduce(([maxChar, maxFreq], [char, freq]) => {\n            if (!maxChar || freq > maxFreq) {\n                return [char, freq];\n            }\n            return [maxChar, maxFreq];\n        });\n    }\n    getMostRareChar() {\n        return Object.entries(this.mapCharToFreq)\n            .reduce(([minChar, minFreq], [char, freq]) => {\n            if (!minChar || freq < minFreq) {\n                return [char, freq];\n            }\n            return [minChar, minFreq];\n        });\n    }\n    build(nodes) {\n        if (nodes.length <= 1) {\n            return nodes[0];\n        }\n        nodes.sort(function (a, b) {\n            return a.freq < b.freq ? 1 : b.freq < a.freq ? -1 : 0;\n        });\n        const lastNode = nodes.pop();\n        const secondToLastNode = nodes.pop();\n        nodes.push(HuffManNode.combine(lastNode, secondToLastNode));\n        return this.build(nodes);\n    }\n    parsingWorked(number, numberPrevious) {\n        return !numberPrevious || Math.abs(number - numberPrevious) > Number.EPSILON;\n    }\n    decompressString(string) {\n        const numbers = string.slice(1, -1).split(',');\n        return numbers.map(n => parseInt(n, 36).toString(2)).join('');\n    }\n    calculateStringReport(string) {\n        return `${(new Set(string.split(''))).size} symbols`;\n    }\n    encode(string, leaveAsBinary = false) {\n        let encodedString = '';\n        let index = -1;\n        while (++index < string.length) {\n            const charAsPattern = new RegExp(this.escape(string[index]));\n            encodedString += this.root.buildPath(charAsPattern);\n        }\n        const result = `$$$$(\"${leaveAsBinary ? encodedString : Object(_binaryStringCompressor__WEBPACK_IMPORTED_MODULE_0__[\"binaryStringCompressor\"])(encodedString)}\")`;\n        if (this.verbose) {\n            const inputStats = this.calculateStringReport(string);\n            this.log(`changed by ${result.length - string.length} characters (${((result.length - string.length) * 100 / string.length).toString().substring(0, 6)}%) ${inputStats}`);\n        }\n        return result;\n    }\n    escape(char) {\n        return ['.', '(', ')', '[', ']', '?', '+', ',', '*', '\\\\'].includes(char) ? `\\\\${char}` : char;\n    }\n    serializeTree() {\n        const chars = this.root.char;\n        const mapPathToChar = {};\n        for (let i = 0; i < chars.length; i++) {\n            const charAsPattern = new RegExp(this.escape(chars[i]));\n            const path = this.root.buildPath(charAsPattern);\n            console.assert(!mapPathToChar.hasOwnProperty(path), `path colision at: ${path} between ${mapPathToChar[path]} and ${chars[i]}.`);\n            mapPathToChar[path] = chars[i];\n        }\n        return mapPathToChar;\n    }\n    makeDecoder() {\n        const decoder = `function ${this.decoderSigniture}(c) {\n  ${Object(_binaryStringCompressor__WEBPACK_IMPORTED_MODULE_0__[\"makeSerializedDecompressor\"])()}\n  let str = bdcmp(c)\n  let i = -1\n  let o = ''\n  const t = ${JSON.stringify(this.serializeTree())}\n  while(++i <= str.length) {\n    if (t.hasOwnProperty(str.slice(0, i === 0 ? 1 : i))) {\n      o += t[str.slice(0, i === 0 ? 1 : i)]\n      str = str.slice(i)\n      i = -1\n    }\n  }\n  return o\n}\\n`;\n        if (this.verbose) {\n            this.log(`decoder size: ${decoder.length}`);\n        }\n        return decoder;\n    }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (HuffManEncoder);\n\n\n//# sourceURL=webpack://strung/./src/HuffManEncoder.ts?");

/***/ }),

/***/ "./src/Segmenter.ts":
/*!**************************!*\
  !*** ./src/Segmenter.ts ***!
  \**************************/
/*! exports provided: Segment, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Segment\", function() { return Segment; });\nclass Segment {\n    constructor(isString = false) {\n        this.content = '';\n        this.end = -1;\n        this.isString = !!isString;\n    }\n    length() {\n        return this.content.length;\n    }\n}\nfunction findStrings(file) {\n    let prevWasBackSlash = false;\n    let index = -1;\n    let segment = new Segment();\n    const segments = [];\n    while (++index < file.length) {\n        if (prevWasBackSlash) {\n            prevWasBackSlash = false;\n            segment.content += `\\${file[index]}`;\n        }\n        else if (file[index] === '\\\\') {\n            prevWasBackSlash = true;\n        }\n        else if (file[index] === '\"' || file[index] === '\\'') {\n            const shouldIncludeInCurrentSeg = segment.isString;\n            if (shouldIncludeInCurrentSeg) {\n                segment.content += file[index];\n            }\n            segment.end = index;\n            segments.push(segment);\n            segment = new Segment(!segment.isString);\n            if (!shouldIncludeInCurrentSeg) {\n                segment.content += file[index];\n            }\n        }\n        else {\n            segment.content += file[index];\n        }\n    }\n    segments.push(segment);\n    return segments;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (findStrings);\n\n\n//# sourceURL=webpack://strung/./src/Segmenter.ts?");

/***/ }),

/***/ "./src/Strungifier.ts":
/*!****************************!*\
  !*** ./src/Strungifier.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _HuffManEncoder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HuffManEncoder */ \"./src/HuffManEncoder.ts\");\n/* harmony import */ var _Segmenter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Segmenter */ \"./src/Segmenter.ts\");\n\n\nfunction segmentIsCompressableString(s) {\n    return s.isString && s.length() > _HuffManEncoder__WEBPACK_IMPORTED_MODULE_0__[\"default\"].decoderCallLength();\n}\nclass Strungifier {\n    constructor(options = {}) {\n        this.segments = [];\n        Object.assign(this, options);\n    }\n    strungify(file) {\n        const segments = Object(_Segmenter__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(file);\n        const encoder = new _HuffManEncoder__WEBPACK_IMPORTED_MODULE_0__[\"default\"](segments\n            .filter(segmentIsCompressableString)\n            .map(s => s.content.slice(1, -1))\n            .join(''), this);\n        segments\n            .filter(segmentIsCompressableString)\n            .forEach(segment => {\n            segment.content = encoder.encode(segment.content.slice(1, -1));\n        });\n        return encoder.makeDecoder() + segments.map(s => s.content).join('');\n    }\n    apply(compiler) {\n        compiler.hooks.compilation.tap('Strung', compilation => {\n            compilation.hooks\n                .succeedModule\n                .tap('Strung', webpackModule => {\n                const input = webpackModule._source.source();\n                const ouput = this.strungify(input);\n                webpackModule._source._value = ouput;\n            });\n        });\n        compiler.hooks.emit.tap('Strung', function (compilation) {\n            let filelist = 'In this build:\\n\\n';\n            for (let filename in compilation.assets) {\n                filelist += ('- ' + filename + '\\n');\n            }\n            compilation.assets['strung-results.md'] = {\n                source: function () {\n                    return filelist;\n                },\n                size: function () {\n                    return filelist.length;\n                }\n            };\n        });\n    }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Strungifier);\n\n\n//# sourceURL=webpack://strung/./src/Strungifier.ts?");

/***/ }),

/***/ "./src/binaryStringCompressor.ts":
/*!***************************************!*\
  !*** ./src/binaryStringCompressor.ts ***!
  \***************************************/
/*! exports provided: binaryStringCompressor, bdcmp, makeSerializedDecompressor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"binaryStringCompressor\", function() { return binaryStringCompressor; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bdcmp\", function() { return bdcmp; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeSerializedDecompressor\", function() { return makeSerializedDecompressor; });\n/* harmony import */ var _encodableSymbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encodableSymbols */ \"./src/encodableSymbols.ts\");\n\nconst endOfFileSymbol = '.';\nconst numberOfEncodables = _encodableSymbols__WEBPACK_IMPORTED_MODULE_0__[\"default\"].length;\nconst bitsPerCharacter = Math.floor(Math.log2(numberOfEncodables));\nfunction binaryStringCompressor(binary) {\n    let string = binary;\n    let output = '';\n    while (string.length >= bitsPerCharacter) {\n        let segment = string.slice(0, bitsPerCharacter);\n        const parsedNumber = parseInt(segment, 2);\n        output += _encodableSymbols__WEBPACK_IMPORTED_MODULE_0__[\"default\"][parsedNumber];\n        string = string.slice(bitsPerCharacter);\n    }\n    if (string.length) {\n        output += _encodableSymbols__WEBPACK_IMPORTED_MODULE_0__[\"default\"][parseInt(string, 2)] +\n            Array(bitsPerCharacter - string.length).fill(endOfFileSymbol).join('');\n    }\n    return output;\n}\nfunction bdcmp(c) {\n    let z = -1;\n    const s = _encodableSymbols__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n    while (c.charAt(c.length - 1 - ++z) === endOfFileSymbol) { }\n    let o = s.indexOf(c.charAt(c.length - z - 1)).toString(2).padStart(bitsPerCharacter, '0').slice(z - bitsPerCharacter);\n    for (let i = c.length - z - 2; i >= 0; i--) {\n        o = s.indexOf(c.charAt(i)).toString(2).padStart(bitsPerCharacter, '0') + o;\n    }\n    return o;\n}\nfunction makeSerializedDecompressor() {\n    let decompressor = bdcmp.toString();\n    const symbols = `'${_encodableSymbols__WEBPACK_IMPORTED_MODULE_0__[\"default\"].join('')}'`;\n    decompressor = decompressor.replace(new RegExp('encodableSymbols', 'g'), symbols)\n        .replace(new RegExp('endOfFileSymbol', 'g'), `'${endOfFileSymbol}'`)\n        .replace(new RegExp('bitsPerCharacter', 'g'), String(bitsPerCharacter));\n    return decompressor;\n}\n\n\n//# sourceURL=webpack://strung/./src/binaryStringCompressor.ts?");

/***/ }),

/***/ "./src/encodableSymbols.ts":
/*!*********************************!*\
  !*** ./src/encodableSymbols.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst encodables = [\n    '!',\n    '#',\n    '$',\n    '%',\n    '&',\n    '(',\n    ')',\n    '*',\n    '+',\n    ',',\n    '-',\n    '/',\n    '0',\n    '1',\n    '2',\n    '3',\n    '4',\n    '6',\n    '7',\n    '8',\n    '9',\n    ':',\n    ';',\n    '<',\n    '=',\n    '>',\n    '?',\n    '@',\n    'A',\n    'B',\n    'C',\n    'D',\n    'E',\n    'F',\n    'G',\n    'H',\n    'I',\n    'J',\n    'K',\n    'L',\n    'M',\n    'N',\n    'O',\n    'P',\n    'Q',\n    'R',\n    'S',\n    'T',\n    'U',\n    'V',\n    'W',\n    'X',\n    'Y',\n    'Z',\n    '[',\n    ']',\n    '^',\n    '_',\n    'a',\n    'b',\n    'c',\n    'd',\n    'e',\n    'f',\n    'g',\n    'h',\n    'i',\n    'j',\n    'k',\n    'l',\n    'm',\n    'n',\n    'o',\n    'p',\n    'q',\n    'r',\n    's',\n    't',\n    'u',\n    'v',\n    'w',\n    'x',\n    'y',\n    'z'\n];\n/* harmony default export */ __webpack_exports__[\"default\"] = (encodables);\n\n\n//# sourceURL=webpack://strung/./src/encodableSymbols.ts?");

/***/ })

/******/ });
});