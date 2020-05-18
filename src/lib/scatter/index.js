"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var d3 = _interopRequireWildcard(require("d3"));

var _method = require("../../lib/method");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// 计算密度
var getPath = function getPath(values, xScale, yScale, width, height) {
  var contours = d3.contourDensity().x(xScale).y(yScale).size([width, height]).bandwidth(8);
  return contours(values);
}; // 根据密度信息绘制轮廓


var getD = function getD(data) {
  return d3.geoPath()(data);
}; // 多功能分类散点图


var Scatter = function Scatter(_ref) {
  var xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      noiseRule = _ref.noiseRule,
      noiseColor = _ref.noiseColor,
      dataColor = _ref.dataColor,
      doSampleNoise = _ref.doSampleNoise,
      sampleFn = _ref.sampleFn,
      doGeoVis = _ref.doGeoVis,
      geoKey = _ref.geoKey,
      data = _ref.data,
      props = _objectWithoutPropertiesLoose(_ref, ["xAxis", "yAxis", "noiseRule", "noiseColor", "dataColor", "doSampleNoise", "sampleFn", "doGeoVis", "geoKey", "data"]);

  var _useState = (0, _react.useState)([]),
      noises = _useState[0],
      setNoises = _useState[1];

  var _useState2 = (0, _react.useState)([]),
      realData = _useState2[0],
      setRealData = _useState2[1];

  var circleRadius = 5; // 由于点坐标的索引坐标指示的是中心的位置，因此需要对比例尺做一定的偏移，避免绘图之后数据点一半在画布之外

  var _ref2 = [xAxis.scaleCore, yAxis.scaleCore],
      xScale = _ref2[0],
      yScale = _ref2[1];
  var _ref3 = [xScale.range(), yScale.range()],
      xRange = _ref3[0],
      yRange = _ref3[1];
  var width = Math.abs(xRange[0] - xRange[1]);
  var height = Math.abs(yRange[0] - yRange[1]);
  xScale = props.updateScale(xScale.range([xRange[0] + circleRadius, xRange[1] - circleRadius]), xAxis);
  yScale = props.updateScale(yScale.range(xAxis.direction === 'top' ? [yRange[0] + circleRadius, yRange[1] - circleRadius] : [yRange[0] - circleRadius, yRange[1] + circleRadius]), yAxis); // 数据处理过滤出绘制的数据点和噪声点

  (0, _react.useEffect)(function () {
    var visualNoises = data.filter(noiseRule);
    var visualData = data.filter(function (d) {
      return !noiseRule(d);
    }); // 如果噪声点需要采样，则需要调用对应的采样函数

    if (doSampleNoise) {
      visualNoises = sampleFn(visualNoises);
    } // 如果数据点需要以密度轮廓的方式绘制且指定了分组属性，则需要先按照指定的属性分组
    // 这里不用 doGeoVis 判断是为了在频繁切换 密度轮廓模式 和 普通点模式 时，避免每次切换都对数组进行重新计算，提高性能和优化交互效果


    if (geoKey) {
      visualData = (0, _method.groupArrayWithKey)(visualData, geoKey);
    } // 写入状态


    setNoises(visualNoises);
    setRealData(visualData);
  }, [data, noiseRule, doSampleNoise, geoKey, sampleFn]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("g", {
    className: "data"
  }, doGeoVis ? realData.map(function (category) {
    var pathContours = getPath(category, xScale, yScale, width, height);
    return /*#__PURE__*/_react.default.createElement("g", {
      key: category[0].category,
      onMouseOver: props.enableHover ? function (e) {
        return props.showTooltip(e.clientX, e.clientY, props.geoHoverHandle(category));
      } : null,
      onMouseOut: props.enableHover ? function (e) {
        return props.hideTooltip();
      } : null
    }, pathContours.map(function (c, index) {
      return /*#__PURE__*/_react.default.createElement("path", {
        key: index,
        className: index === 0 ? 'borderPath' : '',
        fill: typeof dataColor === 'string' ? dataColor : dataColor(category[0]),
        d: getD(c)
      });
    }));
  }) : realData.reduce(function (prev, d) {
    return prev.concat(d);
  }, []).map(function (datum, index) {
    return /*#__PURE__*/_react.default.createElement("circle", {
      key: index,
      cx: xScale(datum),
      cy: yScale(datum),
      r: circleRadius,
      fill: typeof dataColor === 'string' ? dataColor : dataColor(datum),
      onMouseOver: props.enableHover ? function (e) {
        return props.showTooltip(e.clientX, e.clientY, props.pointHoverHandle(datum));
      } : null,
      onMouseOut: props.enableHover ? function (e) {
        return props.hideTooltip();
      } : null
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "noises"
  }, noises.map(function (d, index) {
    return /*#__PURE__*/_react.default.createElement("circle", {
      key: index,
      cx: xScale(d),
      cy: yScale(d),
      r: circleRadius,
      fill: typeof noiseColor === 'string' ? noiseColor : noiseColor(d),
      onMouseOver: props.enableHover ? function (e) {
        return props.showTooltip(e.clientX, e.clientY, props.pointHoverHandle(d));
      } : null,
      onMouseOut: props.enableHover ? function (e) {
        return props.hideTooltip();
      } : null
    });
  })));
};

Scatter.propTypes = {
  xAxis: _propTypes.default.object,
  yAxis: _propTypes.default.object,
  noiseRule: _propTypes.default.func,
  noiseColor: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  dataColor: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  data: _propTypes.default.arrayOf(_propTypes.default.object)
};
var _default = Scatter;
exports.default = _default;