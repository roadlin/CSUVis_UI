"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var d3 = _interopRequireWildcard(require("d3"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * @Author: Lin Xiaoru
 * @Date: 2020-04-16 21:17:12
 * @LastEditTime: 2020-05-18 22:15:33
 * @LastEditors: Please set LastEditors
 * @Description: 视图的包裹容器，本质上是个 svg，自定义添加坐标和宽高
 * @FilePath: /va_module/src/components/axes/index.js
 * @params {*} {
 *  width:Number,           视图的宽度
 *  height:Number,          视图的高度
 *  padding:Array,          视图的内边距，[上，右，下，左]
 *  xAis:Object,            x 坐标轴的配置信息，包括 {
 *      tag:String,             x 轴的标记
 *      type:String,            目前支持 'number'/'date', 
 *      step:Number,            刻度标记的步长(定义域)
 *      formatFn:Function,      刻度标记的格式化函数 d => {...}
 *      scaleFn:Function,       比如 d3.scaleLinear, d3.scaleTime, 
 *      direction:String,       坐标轴的位置, 'top'/'bottom'/'left'/'right'
 *      domain:Array,           坐标轴的定义域
 *      range:Array,            可以定义坐标轴的值域，用于定制 detail-on-demand 的多尺度坐标轴，domain 属性要与 range 对应
 *      tickValues:Array,       可以指定显示的刻度标记
 *      isShow:Boolean,         是否显示
 *      showGrid:Boolean        是否显示分隔网格     
 *  } 
 *  yAix:Object,            y 坐标轴的配置信息，配置项同 xAis
 * }
 */
// import {createAxis} from '../../lib/method'
// 生成坐标轴的分隔符，如果 type 是 date, step 应是秒
var createTickValues = function createTickValues(domain, type, step) {
  var rangeFn = d3.range;

  if (type === 'date') {
    domain = domain.map(function (d) {
      return new Date(d).getTime();
    });
    rangeFn = d3.timeSecond.range;
  }

  var from = d3.min(domain),
      to = d3.max(domain);
  return [].concat(rangeFn(from, to, step), [to]);
}; // 创建坐标


var createAxis = function createAxis(config, range, ref, verticalRange) {
  var directionMap = {
    top: 'axisTop',
    bottom: 'axisBottom',
    left: 'axisLeft',
    right: 'axisRight'
  };
  var domain = config.domain,
      type = config.type,
      step = config.step,
      formatFn = config.formatFn,
      scaleFn = config.scaleFn,
      direction = config.direction,
      tickValues = config.tickValues;
  var scale = scaleFn().domain(domain).range(range);
  var ticks = Array.isArray(tickValues) ? tickValues : createTickValues(domain, type, step);
  var axis = d3[directionMap[direction]](scale).tickValues(ticks).tickFormat(formatFn);
  var axisGroup = d3.select(ref.current).call(axis) // 当坐标刻度太多时，容易拥挤，则每隔几个刻度才添加标识信息
  .call(function (g) {
    // 先显示所有，再按要求隐藏，否则在动画时会依次将 text 隐藏
    g.selectAll('.tick text').style('display', 'block');

    if (ticks.length > 20) {
      var _step = Math.ceil(ticks.length / 10);

      g.selectAll(".tick:not(:nth-of-type(" + _step + "n)) text").style('display', 'none');
    }
  }); // 如果不要显示坐标线，则将其隐藏

  if (config.showPath === false) {
    axisGroup.call(function (g) {
      return g.select('.domain').remove();
    });
  } // 如果需要显示网格则将坐标刻度延长


  if (config.showGrid) {
    var tickLinesDecorator;

    var tickLinesDecoratorCreator = function tickLinesDecoratorCreator(key, offset) {
      return function (g) {
        return g.selectAll('.tick').append('line').classed('gridLine', true).attr('stroke-opacity', 0.5).attr(key, offset);
      };
    };

    var lineLength = d3.max(verticalRange) - d3.min(verticalRange);

    switch (config.direction) {
      case 'left':
        tickLinesDecorator = tickLinesDecoratorCreator('x1', lineLength);
        break;

      case 'right':
        tickLinesDecorator = tickLinesDecoratorCreator('x1', -lineLength);
        break;

      case 'top':
        tickLinesDecorator = tickLinesDecoratorCreator('y1', lineLength);
        break;

      case 'bottom':
        tickLinesDecorator = tickLinesDecoratorCreator('y1', -lineLength);
        break;

      default:
        return;
    }

    axisGroup.call(tickLinesDecorator);
  }
}; // 支持双坐标


var VASvg = function VASvg(_ref) {
  var width = _ref.width,
      height = _ref.height,
      padding = _ref.padding,
      xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      refObj = _ref.refObj,
      viewboxId = _ref.viewboxId,
      children = _ref.children;
  var xRef = (0, _react.useRef)();
  var yRefs = [(0, _react.useRef)(), (0, _react.useRef)()];
  var xTicks = (0, _react.useRef)();
  var yTicks = (0, _react.useRef)([]); // y 轴配置转化为数组，方便逻辑实现

  var yAxes = Array.isArray(yAxis) ? yAxis : [yAxis];
  (0, _react.useEffect)(function () {
    // 如果需要保持刻度不变时，则需在初始化时将其坐标刻度存下来，在渲染坐标轴时传入
    if (xAxis.holdTicks) {
      xTicks.current = xAxis.tickValues || createTickValues(xAxis.initDomain, xAxis.type, xAxis.step);
    } // 如果存在多坐标轴，则以数组形式存储


    if (yAxes.length) {
      yTicks.current = yAxes.map(function (y) {
        if (y.holdTicks) {
          return y.tickValues || createTickValues(y.initDomain, y.type, y.step);
        }

        return null;
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xAxis.initDomain, yAxes.map(function (y) {
    return y.initDomain;
  })]);
  (0, _react.useEffect)(function () {
    var xRange = xAxis && xAxis.range || [padding[3], width - padding[1]];
    var yRange = yAxes.length && yAxes.map(function (y) {
      return y && y.range || [height - padding[2], padding[0]];
    });
    var view = d3.select(refObj.current); // 渲染 x 坐标

    if (xAxis && xAxis.isShow) {
      createAxis(Object.assign({
        tickValues: xTicks.current
      }, xAxis), xRange, xRef, yRange[0]); // 如果不显示 x 轴属性信息，则需要把最后一个刻度信息显示出来

      if (!xAxis.tag) {
        var ticks = view.selectAll('.axis.x .tick');
        ticks.filter(':last-of-type').style('display', 'block');
      }
    } // 渲染 y 坐标


    if (yAxes.length) {
      yAxes.forEach(function (y, i) {
        if (y && y.isShow) {
          createAxis(Object.assign({
            tickValues: yTicks.current[i]
          }, y), yRange[i], yRefs[i], xRange); // 当 x 坐标轴在上方时，y 轴的标记信息应该在底部

          if (xAxis.direction === 'top') {
            var _ticks = d3.select(yRefs[i].current).selectAll('.tick');

            _ticks.filter(':first-of-type').style('display', 'none');

            _ticks.filter(':last-of-type').style('display', 'block');
          } // 如果不显示 x 轴属性信息，则需要把最后一个刻度信息显示出来


          if (!y.tag) {
            var _ticks2 = view.selectAll(".y." + y.direction + " .tick");

            _ticks2.filter("" + (xAxis.direction === 'top' ? ':first-of-type' : ':last-of-type')).style('display', 'block');
          }
        }
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [xAxis, yAxes, height, width, padding, refObj]);
  return /*#__PURE__*/_react.default.createElement("svg", {
    style: {
      width: width + "px",
      height: height + "px"
    },
    ref: refObj,
    className: viewboxId
  }, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
    id: viewboxId
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 0,
    y: 0,
    width: width - padding[1] - padding[3],
    height: height - padding[0] - padding[2]
  }))), /*#__PURE__*/_react.default.createElement("g", {
    className: "view",
    transform: "translate(" + padding[3] + ", " + padding[0] + ")",
    clipPath: "url(#" + viewboxId + ")"
  }, children), /*#__PURE__*/_react.default.createElement("g", {
    className: "axis x",
    ref: xRef,
    transform: xAxis.direction === 'bottom' ? "translate(0, " + (height - padding[2]) + ")" : "translate(0, " + padding[0] + ")"
  }, xAxis.isShow && /*#__PURE__*/_react.default.createElement("text", {
    className: "axisTag",
    transform: "translate(" + (width - padding[1]) + ", " + (xAxis.direction === 'bottom' ? 15 : -10) + ")"
  }, xAxis.tag)), yAxes.length && /*#__PURE__*/_react.default.createElement("g", null, yAxes.map(function (y, i) {
    return /*#__PURE__*/_react.default.createElement("g", {
      className: "axis y " + y.direction,
      key: i,
      ref: yRefs[i],
      transform: y.direction === 'left' ? "translate(" + padding[3] + ", 0)" : "translate(" + (width - padding[1]) + ", 0)"
    }, y.isShow && /*#__PURE__*/_react.default.createElement("text", {
      className: "axisTag",
      transform: "translate(" + (y.direction === 'left' ? -5 : 5) + ", " + (xAxis.direction === 'bottom' ? padding[0] : height - padding[2]) + ")"
    }, y.tag));
  })));
};

VASvg.propTypes = {
  width: _propTypes.default.number,
  height: _propTypes.default.number,
  padding: _propTypes.default.array,
  xAxis: _propTypes.default.object,
  yAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.array])
};
var _default = VASvg;
exports.default = _default;