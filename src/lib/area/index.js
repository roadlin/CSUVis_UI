"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

require("./index.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CIRCLE_RADIUS = 2.5;
var TRIANGLE_OFFSET = 3;

var MultiArea = function MultiArea(_ref) {
  var height = _ref.height,
      padding = _ref.padding,
      xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      areaConfig = _ref.areaConfig,
      data = _ref.data,
      props = _objectWithoutPropertiesLoose(_ref, ["height", "padding", "xAxis", "yAxis", "areaConfig", "data"]);

  var _useState = (0, _react.useState)([]),
      levelData = _useState[0],
      setLevelData = _useState[1]; // const [circleLineData, setCircleLineData] = useState([])
  // const [triangleLineData, setTriangleLineData] = useState([])


  var thds = areaConfig.levels;
  var canvasHeight = height - padding[0] - padding[2];
  var setting = areaConfig.setting; // 数据预处理：根据阈值切分数据

  (0, _react.useEffect)(function () {
    var dataSpliceWithLevels = new Array(6).fill(1).map(function (val, index) {
      return {
        diffSection: [thds[index], thds[index + 1]],
        values: []
      };
    });

    for (var i = 0; i < data.length; i++) {
      var _element;

      var diff = data[i][areaConfig.key] - setting;
      var element = (_element = {}, _element[xAxis.key] = data[i][xAxis.key], _element[areaConfig.key] = 0, _element); // levels: [-30, -20, -10, 0, 10, 20, 30]

      if (diff < 0) {
        dataSpliceWithLevels[3].values.push(element);
        dataSpliceWithLevels[4].values.push(element);
        dataSpliceWithLevels[5].values.push(element);
        /* 
            合并多个分支，比如配置 levels = [-30, -20, -10, 0, 10, 20, 30]
            某一采集数据偏差为 -25，则应该存储为 3 段：
            在 [-30, -20) 区间存储 -25
            在 [-20, -10) 区间存储 -20
            在 [-10, 0) 区间存储 -10
        */

        if (diff < thds[3]) {
          var _objectSpread2;

          dataSpliceWithLevels[2].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread2 = {}, _objectSpread2[areaConfig.key] = diff >= thds[2] ? diff : thds[2], _objectSpread2)));
        } else {
          var _objectSpread3;

          dataSpliceWithLevels[2].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread3 = {}, _objectSpread3[areaConfig.key] = 0, _objectSpread3)));
        }

        if (diff < thds[2]) {
          var _objectSpread4;

          dataSpliceWithLevels[1].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread4 = {}, _objectSpread4[areaConfig.key] = diff >= thds[1] ? diff : thds[1], _objectSpread4)));
        } else {
          var _objectSpread5;

          dataSpliceWithLevels[1].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread5 = {}, _objectSpread5[areaConfig.key] = 0, _objectSpread5)));
        }

        if (diff < thds[1]) {
          var _objectSpread6;

          dataSpliceWithLevels[0].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread6 = {}, _objectSpread6[areaConfig.key] = diff >= thds[0] ? diff : thds[0], _objectSpread6)));
        } else {
          var _objectSpread7;

          dataSpliceWithLevels[0].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread7 = {}, _objectSpread7[areaConfig.key] = 0, _objectSpread7)));
        }
      } else {
        dataSpliceWithLevels[0].values.push(element);
        dataSpliceWithLevels[1].values.push(element);
        dataSpliceWithLevels[2].values.push(element);

        if (diff >= thds[3]) {
          var _objectSpread8;

          dataSpliceWithLevels[3].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread8 = {}, _objectSpread8[areaConfig.key] = diff < thds[4] ? diff : thds[4], _objectSpread8)));
        } else {
          var _objectSpread9;

          dataSpliceWithLevels[3].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread9 = {}, _objectSpread9[areaConfig.key] = 0, _objectSpread9)));
        }

        if (diff >= thds[4]) {
          var _objectSpread10;

          dataSpliceWithLevels[4].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread10 = {}, _objectSpread10[areaConfig.key] = diff < thds[5] ? diff : thds[5], _objectSpread10)));
        } else {
          var _objectSpread11;

          dataSpliceWithLevels[4].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread11 = {}, _objectSpread11[areaConfig.key] = 0, _objectSpread11)));
        }

        if (diff >= thds[5]) {
          var _objectSpread12;

          dataSpliceWithLevels[5].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread12 = {}, _objectSpread12[areaConfig.key] = diff < thds[6] ? diff : thds[6], _objectSpread12)));
        } else {
          var _objectSpread13;

          dataSpliceWithLevels[5].values.push(_objectSpread(_objectSpread({}, element), {}, (_objectSpread13 = {}, _objectSpread13[areaConfig.key] = 0, _objectSpread13)));
        }
      }
    }

    setLevelData(dataSpliceWithLevels);
  }, [areaConfig.key, data, setting, thds, xAxis.key]); // 比例尺

  var circleLineScale = yAxis[0].scale;
  var triangleLineScale = yAxis[1].scale;
  var xScale = xAxis.scale;

  var areaDecorator = function areaDecorator(scale, y0) {
    return d3.area().curve(d3.curveMonotoneX).x(xScale).y1(function (d) {
      return scale(d[areaConfig.key]);
    }).y0(y0);
  };

  var lineDecorator = function lineDecorator(scale) {
    return d3.line().curve(d3.curveMonotoneX).x(xScale).y(scale);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("g", {
    className: "area"
  }, /*#__PURE__*/_react.default.createElement("g", {
    className: "lowerArea"
  }, levelData.slice(0, 3).reverse().map(function (d, i) {
    var scale = d3.scaleLinear().domain(d.diffSection).range([canvasHeight, 0]);
    var areaScale = areaDecorator(scale, 0);
    return /*#__PURE__*/_react.default.createElement("path", {
      key: i,
      className: "area",
      fill: areaConfig.colorMap.lower[i],
      d: areaScale(d.values)
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "higherArea"
  }, levelData.slice(3).map(function (d, i) {
    var scale = d3.scaleLinear().domain(d.diffSection).range([canvasHeight, 0]);
    var areaScale = areaDecorator(scale, canvasHeight);
    return /*#__PURE__*/_react.default.createElement("path", {
      key: i,
      className: "area",
      fill: areaConfig.colorMap.higher[i],
      d: areaScale(d.values)
    });
  }))), /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("g", {
    className: "circleLine"
  }, /*#__PURE__*/_react.default.createElement("path", {
    className: "line",
    d: lineDecorator(circleLineScale)(data)
  }), data.map(function (d) {
    return /*#__PURE__*/_react.default.createElement("circle", {
      className: "dot",
      key: d.time,
      cx: xScale(d),
      cy: circleLineScale(d),
      r: CIRCLE_RADIUS
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "triangleLine"
  }, /*#__PURE__*/_react.default.createElement("path", {
    className: "line",
    d: lineDecorator(triangleLineScale)(data)
  }), data.map(function (d) {
    var x = xScale(d);
    var y = triangleLineScale(d);
    return /*#__PURE__*/_react.default.createElement("path", {
      className: "dot",
      key: d.time,
      d: "M" + (x - 3) + " " + (y + TRIANGLE_OFFSET) + " L" + (x + 3) + " " + (y + TRIANGLE_OFFSET) + " L" + x + " " + (y - TRIANGLE_OFFSET) + "Z"
    });
  }))));
};

var _default = MultiArea;
exports.default = _default;