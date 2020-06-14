"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

require("./index.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
      higherData = _useState[0],
      setHigherData = _useState[1];

  var _useState2 = (0, _react.useState)([]),
      lowerData = _useState2[0],
      setLowerData = _useState2[1]; // const [circleLineData, setCircleLineData] = useState([])
  // const [triangleLineData, setTriangleLineData] = useState([])


  var thds = areaConfig.levels;
  var canvasHeight = height - padding[0] - padding[2];
  var setting = areaConfig.setting; // 数据预处理：根据阈值切分数据

  (0, _react.useEffect)(function () {
    var lower = [],
        higher = [];

    for (var i = 0; i < data.length; i++) {
      var _element;

      var diff = data[i][areaConfig.key] - setting;
      var element = (_element = {}, _element[xAxis.key] = data[i][xAxis.key], _element.lower3 = 0, _element.lower2 = 0, _element.lower1 = 0, _element.higher3 = 0, _element.higher2 = 0, _element.higher1 = 0, _element); // levels: [-30, -20, -10, 0, 10, 20, 30]

      if (diff < 0) {
        /* 
            比如配置 levels = [-30, -20, -10, 0, 10, 20, 30]
            某一采集数据偏差为 -25，则应该存储为 3 段：
            在 [-30, -20) 区间存储 -5
            在 [-20, -10) 区间存储 -10
            在 [-10, 0) 区间存储 -10
        */
        if (diff < thds[0]) {
          element.lower3 = thds[0] - thds[1];
          element.lower2 = thds[1] - thds[2];
          element.lower1 = thds[2] - thds[3];
        } else if (diff < thds[1]) {
          element.lower3 = diff - thds[1];
          element.lower2 = thds[1] - thds[2];
          element.lower1 = thds[2] - thds[3];
        } else if (diff < thds[2]) {
          element.lower2 = diff - thds[2];
          element.lower1 = thds[2] - thds[3];
        } else {
          element.lower1 = diff - thds[3];
        } // element.lower3 = diff < thds[1] ? Math.max(diff - thds[1], thds[0] - thds[1]) : 0
        // element.lower2 = diff < thds[2] ? Math.max(diff - thds[2], thds[1] - thds[2]) : 0
        // element.lower1 = diff < thds[3] ? Math.max(diff - thds[3], thds[2] - thds[3]) : 0

      } else {
        // element.higher3 = diff > thds[5] ? Math.min(thds[6] - diff, thds[6] - thds[5]) : 0
        // element.higher2 = diff > thds[4] ? Math.min(thds[5] - diff, thds[5] - thds[4]) : 0
        // element.higher1 = diff > thds[3] ? Math.min(thds[4] - diff, thds[4] - thds[3]) : 0
        if (diff > thds[6]) {
          element.higher3 = thds[6] - thds[5];
          element.higher2 = thds[5] - thds[4];
          element.higher1 = thds[4] - thds[3];
        } else if (diff > thds[5]) {
          element.higher3 = diff - thds[5];
          element.higher2 = thds[5] - thds[4];
          element.higher1 = thds[4] - thds[3];
        } else if (diff > thds[4]) {
          element.higher2 = diff - thds[4];
          element.higher1 = thds[4] - thds[3];
        } else {
          element.higher1 = diff - thds[3];
        }
      }

      lower.push(element);
      higher.push(element);
    }

    setHigherData(higher);
    setLowerData(lower);
  }, [areaConfig.key, data, setting, thds, xAxis.key]); // 比例尺

  var circleLineScale = yAxis[0].scale;
  var triangleLineScale = yAxis[1].scale;
  var xScale = xAxis.scale;

  var getSeries = function getSeries(data, keys) {
    return keys.map(function (key) {
      return data.map(function (d) {
        var _ref2;

        return _ref2 = {}, _ref2[xAxis.key] = d[xAxis.key], _ref2.val = d[key], _ref2;
      });
    });
  };

  var getScale = function getScale(domain, range) {
    return d3.scaleLinear().domain(domain).range(range);
  };

  var areaDecorator = function areaDecorator(scale, y0) {
    return d3.area().curve(d3.curveBasis).x(xScale).y1(function (d) {
      return scale(d.val);
    }).y0(y0);
  };

  var lineDecorator = function lineDecorator(scale) {
    return d3.line().curve(d3.curveMonotoneX).x(xScale).y(scale);
  }; // 作图的相关变量


  var lowerSeries = getSeries(lowerData, ['lower1', 'lower2', 'lower3']);
  var higherSeries = getSeries(higherData, ['higher1', 'higher2', 'higher3']);
  var higherDomains = [[0, thds[4] - thds[3]], [0, thds[5] - thds[4]], [0, thds[6] - thds[5]]];
  var lowerDomains = [[0, thds[2] - thds[3]], [0, thds[1] - thds[2]], [0, thds[0] - thds[1]]];
  var higherRange = [canvasHeight, 0];
  var lowerRange = [0, canvasHeight];
  var higherY0 = canvasHeight;
  var lowerY0 = 0;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("g", {
    className: "area"
  }, /*#__PURE__*/_react.default.createElement("g", {
    className: "lowerArea"
  }, lowerSeries.map(function (series, i) {
    return /*#__PURE__*/_react.default.createElement("path", {
      key: i,
      className: "area_" + i,
      fill: areaConfig.colorMap.lower[i],
      d: areaDecorator(getScale(lowerDomains[i], lowerRange), lowerY0)(series)
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "higherArea"
  }, higherSeries.map(function (series, i) {
    return /*#__PURE__*/_react.default.createElement("path", {
      key: i,
      className: "area_" + i,
      fill: areaConfig.colorMap.higher[i],
      d: areaDecorator(getScale(higherDomains[i], higherRange), higherY0)(series)
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