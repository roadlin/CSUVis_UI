"use strict";

exports.__esModule = true;
exports.MultiArea = exports.Stack = exports.Strap = exports.Scatter = exports.River = void 0;

var _VASvgCreate = _interopRequireDefault(require("./VASvgCreate"));

var _VASvgCreateDoubleAxes = _interopRequireDefault(require("./VASvgCreateDoubleAxes"));

var _river = _interopRequireDefault(require("./river"));

var _scatter = _interopRequireDefault(require("./scatter"));

var _strap = _interopRequireDefault(require("./strap"));

var _stack = _interopRequireDefault(require("./stack"));

var _area = _interopRequireDefault(require("./area"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: Lin Xiaoru
 * @Date: 2020-04-17 13:20:01
 * @LastEditTime: 2020-04-27 21:09:18
 * @LastEditors: Please set LastEditors
 * @Description: 统一导出组件
 * @FilePath: /va_module/src/components/index.js
 */
var River = (0, _VASvgCreate.default)(_river.default, 'riverViewBox');
exports.River = River;
var Scatter = (0, _VASvgCreate.default)(_scatter.default, 'scatterViewBox');
exports.Scatter = Scatter;
var Strap = (0, _VASvgCreate.default)(_strap.default, 'strapViewBox');
exports.Strap = Strap;
var Stack = (0, _VASvgCreate.default)(_stack.default, 'stackViewBox');
exports.Stack = Stack;
var MultiArea = (0, _VASvgCreateDoubleAxes.default)(_area.default, 'areaViewBox'); // export { default as Scatter } from './scatter'

exports.MultiArea = MultiArea;