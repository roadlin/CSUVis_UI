"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var d3 = _interopRequireWildcard(require("d3"));

var _method = require("../method");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * 返回一个计算 path 路径的函数
 * @param function xFn x坐标的比例尺
 * @param function yFn y坐标的比例尺
 */
var clusterLine = function clusterLine(xFn, yFn) {
  return d3.line().defined(function (d) {
    return d;
  }).x(function (d) {
    return xFn(d);
  }).y(function (d) {
    return yFn(d);
  });
};
/**
 * 根据前后数据节点计算平行四边形的四个点
 * @param {*} node 
 * @param {*} next 
 * @param {*} option 
 */


var getPoints = function getPoints(node, next, option) {
  //计算平行四边形的点坐标
  next = next || node;
  var scaleX = option.scaleX,
      scaleY = option.scaleY,
      bandScale = option.bandScale,
      key = option.key,
      direction = option.direction;
  var nowIntervalBand = direction === 'left' ? -bandScale(node[key] / 2) : bandScale(node[key] / 2);
  var nextIntervalBand = direction === 'left' ? -bandScale(next[key] / 2) : bandScale(next[key] / 2);
  return scaleX(node) + nowIntervalBand + ", " + scaleY(node) + "\n        " + scaleX(node) + ", " + scaleY(node) + "\n        " + scaleX(next) + ", " + scaleY(next) + "\n        " + (scaleX(next) + nextIntervalBand) + ", " + scaleY(next) + "\n    ";
}; // 流图组件


var River = function River(_ref) {
  var xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      band = _ref.band,
      highlight = _ref.highlight,
      leftPoly = _ref.leftPoly,
      rightPoly = _ref.rightPoly,
      data = _ref.data,
      formatConfig = _ref.formatConfig,
      enableHover = _ref.enableHover,
      hoverHandle = _ref.hoverHandle,
      props = _objectWithoutPropertiesLoose(_ref, ["xAxis", "yAxis", "band", "highlight", "leftPoly", "rightPoly", "data", "formatConfig", "enableHover", "hoverHandle"]);

  var _useState = (0, _react.useState)(null),
      riverData = _useState[0],
      setRiverData = _useState[1];

  var _ref2 = [xAxis.scale, yAxis.scale],
      xScale = _ref2[0],
      yScale = _ref2[1]; // 初始化数据集

  (0, _react.useEffect)(function () {
    // 1. 首先按照类别分类数据，同个类别的数据放在一个数组中
    var categories = (0, _method.groupArrayWithKey)(data, 'category');
    categories = categories.map(function (c) {
      // 2. 接着按照设定的 y 轴键值对类别内的数据再次进行分组，如果同组之内有多个信号，则求平均值，并作为一个数据点
      var childCategories = (0, _method.groupArrayWithKey)(c, yAxis.key);
      childCategories = childCategories.map(function (cc) {
        if (cc.length === 1) return cc[0];
        var unitData = {};

        var _loop = function _loop(k) {
          if (formatConfig.meanKeys.includes(k)) {
            unitData[k] = d3.mean(cc.map(function (d) {
              return d[k];
            }));
          } else {
            unitData[k] = cc[0][k];
          }
        };

        for (var k in cc[0]) {
          _loop(k);
        }

        return unitData;
      }).sort(function (a, b) {
        return a.time - b.time;
      }); // 3. 按照 y 轴键值和设置的阈值，当相邻两个数据的 yKey 值大于阈值时，则切分为两个碎片

      return (0, _method.sliceArrayWithKey)(childCategories, yAxis.key, yAxis.thd);
    });
    setRiverData(categories);
  }, [data, yAxis, formatConfig.meanKeys]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("defs", null), /*#__PURE__*/_react.default.createElement("g", {
    className: "legends"
  }), /*#__PURE__*/_react.default.createElement("g", {
    className: "river"
  }, riverData && riverData.map(function (category) {
    return /*#__PURE__*/_react.default.createElement("g", {
      className: "categories",
      key: category[0][0].category
    }, category.map(function (slice, index) {
      return /*#__PURE__*/_react.default.createElement("g", {
        className: "slice",
        key: index
      }, slice.map(function (d, i) {
        // 流图左右的平行四边形
        return /*#__PURE__*/_react.default.createElement("g", {
          className: "riverUnit",
          key: i
        }, /*#__PURE__*/_react.default.createElement("polygon", {
          fill: leftPoly.scale(d[leftPoly.key]),
          points: getPoints(d, slice[i + 1], {
            scaleX: xScale,
            scaleY: yScale,
            bandScale: band.scale,
            key: band.key,
            direction: 'left'
          }),
          onMouseOver: enableHover ? function (e) {
            return props.showTooltip(e.clientX, e.clientY, hoverHandle(d));
          } : null,
          onMouseOut: enableHover ? function (e) {
            return props.hideTooltip();
          } : null
        }), /*#__PURE__*/_react.default.createElement("polygon", {
          fill: rightPoly.scale(d[rightPoly.key]),
          points: getPoints(d, slice[i + 1], {
            scaleX: xScale,
            scaleY: yScale,
            bandScale: band.scale,
            key: band.key,
            direction: 'right'
          }),
          onMouseOver: enableHover ? function (e) {
            return props.showTooltip(e.clientX, e.clientY, hoverHandle(d));
          } : null,
          onMouseOut: enableHover ? function (e) {
            return props.hideTooltip();
          } : null
        }));
      }), /*#__PURE__*/_react.default.createElement("path", {
        stroke: highlight.color || '#f04148',
        d: clusterLine(xScale, yScale)(slice),
        className: slice[0][highlight.key] ? 'highlight' : 'riverPath'
      }));
    }));
  })));
};

River.propTypes = {
  xAxis: _propTypes.default.object,
  yAxis: _propTypes.default.object,
  band: _propTypes.default.object,
  highLight: _propTypes.default.object,
  leftPoly: _propTypes.default.object,
  rightPoly: _propTypes.default.object,
  data: _propTypes.default.array
};
var _default = River;
exports.default = _default;