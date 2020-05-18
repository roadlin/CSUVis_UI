"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _gradient = _interopRequireDefault(require("../gradient"));

var _method = require("../method.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Strap = function Strap(_ref) {
  var xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      colorScale = _ref.colorScale,
      data = _ref.data,
      _ref$enableHover = _ref.enableHover,
      enableHover = _ref$enableHover === void 0 ? false : _ref$enableHover,
      hoverHandle = _ref.hoverHandle,
      props = _objectWithoutPropertiesLoose(_ref, ["xAxis", "yAxis", "colorScale", "data", "enableHover", "hoverHandle"]);

  var _useState = (0, _react.useState)([]),
      dataset = _useState[0],
      setDataset = _useState[1];

  var _useState2 = (0, _react.useState)([]),
      gradients = _useState2[0],
      setGradients = _useState2[1];

  var rects = (0, _react.useRef)(); // 数据分组，计算渐变色配置

  (0, _react.useEffect)(function () {
    var dataGroups = (0, _method.groupArrayWithKey)(data, yAxis.key).sort(function (a, b) {
      return a[0].time - b[0].time;
    });
    var gradientsData = dataGroups.map(function (dataGroup) {
      return dataGroup.map(function (d) {
        return {
          color: colorScale(d),
          offset: Math.abs((d[xAxis.key] - Math.min.apply(Math, xAxis.domain)) / (xAxis.domain[0] - xAxis.domain[1]))
        };
      });
    });
    setDataset(dataGroups);
    setGradients(gradientsData);
  }, [data, yAxis.key, colorScale, xAxis]);
  var yScale = yAxis.scale;
  var _ref2 = [xAxis.scaleCore, yAxis.scaleCore],
      xScaleCore = _ref2[0],
      yScaleCore = _ref2[1];
  var xDomain = xScaleCore.domain();
  var yDomain = yScaleCore.domain();
  var yRange = yScaleCore.range().map(function (r) {
    return r * (Math.abs(yAxis.domain[0] - yAxis.domain[1]) / Math.abs(yDomain[0] - yDomain[1]));
  });
  var xRange = xScaleCore.range().map(function (r) {
    return r * (Math.abs(xAxis.domain[0] - xAxis.domain[1]) / Math.abs(xDomain[0] - xDomain[1]));
  });
  var rectW = Math.abs(xRange[0] - xRange[1]);

  var rectHoverHandle = function rectHoverHandle(e) {
    var xInput = xScaleCore.invert(e.offsetX - props.padding[3]);
    var yInput = yScaleCore.invert(e.offsetY - props.padding[0]);
    xInput = xAxis.type === 'number' ? xInput.toFixed(2) : xAxis.formatFn(xInput);
    yInput = yAxis.type === 'number' ? yInput.toFixed(2) : yAxis.formatFn(yInput);
    var content = hoverHandle(xInput, yInput);
    props.showTooltip(e.clientX, e.clientY, content);
  }; // 由于依赖到比例尺，因此当缩放时，需要重新进行事件绑定


  (0, _react.useEffect)(function () {
    var reactContaner = rects.current;

    var mouseoverHandle = function mouseoverHandle(e) {
      return rectHoverHandle(e);
    };

    var mouseoutHandle = props.hideTooltip;

    if (enableHover) {
      reactContaner.addEventListener('mouseover', mouseoverHandle);
      reactContaner.addEventListener('mouseout', mouseoutHandle);
    }

    return function () {
      reactContaner.removeEventListener('mouseover', mouseoverHandle);
      reactContaner.removeEventListener('mouseout', mouseoutHandle);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xScaleCore, yScaleCore]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("defs", null, gradients.map(function (gradient, i) {
    return /*#__PURE__*/_react.default.createElement(_gradient.default, {
      key: i,
      id: "situationColor_" + i,
      rule: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
      },
      gradientColors: gradient
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "rects",
    ref: rects
  }, dataset.map(function (datum, i) {
    var rectH = i < dataset.length - 1 ? Math.abs(yScale(datum[0]) - yScale(dataset[i + 1][0])) : Math.abs(yScale(datum[0]) - Math.min.apply(Math, yRange));
    return /*#__PURE__*/_react.default.createElement("rect", {
      key: "rect" + datum[0][yAxis.key],
      x: 0,
      y: i < dataset.length - 1 ? yScale(dataset[i + 1][0]) : 0,
      width: rectW,
      height: rectH,
      fill: "url('#situationColor_" + i + "')"
    });
  })));
};

var _default = Strap;
exports.default = _default;