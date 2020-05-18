"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _gradient = _interopRequireDefault(require("../gradient"));

var d3 = _interopRequireWildcard(require("d3"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// 椭圆纵向的高度半径
var ry = 5;
/**
 * 用于可视化堆栈图中的统计数据
 * @param {*} param0 
 * x:Number             算珠的 x 坐标
 * y:Number             算珠的 y 坐标
 * colorMap:Object      算珠填充色的编码信息，data 中 key <=> color
 * direction:String     算珠的叠放方向， 'top' / 'bottom'
 * data:Array           数据，元素格式为 {key, val, r}
 */

var Beads = function Beads(_ref) {
  var x = _ref.x,
      y = _ref.y,
      colorMap = _ref.colorMap,
      direction = _ref.direction,
      data = _ref.data;
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "beads",
    transform: "translate(" + x + ", " + y + ")"
  }, data.filter(function (datum) {
    return datum.val !== 0;
  }).map(function (datum, index) {
    return /*#__PURE__*/_react.default.createElement("ellipse", {
      key: "bead_" + datum.key,
      cx: "0",
      cy: direction === 'bottom' ? index * (ry * 2 + 1) : -index * (ry * 2 + 1),
      rx: datum.r,
      ry: ry,
      fill: colorMap[datum.key]
    });
  }));
};
/**
 * 
 * @param {*} param0 
 *  beadConfig:Objcet                 算珠的配置信息  {
 *      colorMap,
 *      widthScale,
 *      topBeadsData,
 *      bottomBeadsData
 *  }
 *  stackColorScale,                    渐变色的比例尺
 *  strokeColorMap,                     边界的颜色映射，什么 key 对应什么颜色
 */


var Stack = function Stack(_ref2) {
  var xAxis = _ref2.xAxis,
      keyword = _ref2.keyword,
      beadConfig = _ref2.beadConfig,
      stackColorScale = _ref2.stackColorScale,
      strokeColorMap = _ref2.strokeColorMap,
      stackData = _ref2.stackData,
      gradientData = _ref2.gradientData,
      _ref2$enableHover = _ref2.enableHover,
      enableHover = _ref2$enableHover === void 0 ? false : _ref2$enableHover,
      hoverHandle = _ref2.hoverHandle,
      props = _objectWithoutPropertiesLoose(_ref2, ["xAxis", "keyword", "beadConfig", "stackColorScale", "strokeColorMap", "stackData", "gradientData", "enableHover", "hoverHandle"]);

  // console.log()
  var _useState = (0, _react.useState)([]),
      stackGroup = _useState[0],
      setStackGroup = _useState[1];

  var _useState2 = (0, _react.useState)({}),
      gradient = _useState2[0],
      setGradient = _useState2[1];

  var stackBody = (0, _react.useRef)(); // 将原始数据转化为堆叠数据格式

  var getSeries = function getSeries(data, keys) {
    return d3.stack().keys(keys)(data);
  };

  var getScale = function getScale(series, range) {
    return d3.scaleLinear().domain([0, d3.max(series, function (d) {
      return d3.max(d, function (d) {
        return d[1];
      });
    })]).range(range);
  };

  var containerHeight = props.height - props.padding[0] - props.padding[2]; // let horizontalMargin = d3.max(beadConfig.widthScale.range())
  // 堆栈图的视图结构与其他视图差异较大，在初始化时需要去除遮罩层

  (0, _react.useEffect)(function () {
    d3.select(stackBody.current.parentNode).attr('clip-path', '');
  }, []);
  (0, _react.useEffect)(function () {
    var step = 1 / stackData.length;
    var gradientDataset = gradientData || stackData;
    var gradientBands = {}; // 记录需要绘制的堆叠信息

    var renderKeys = Object.keys(stackData[0]).filter(function (key) {
      return key.indexOf(keyword) !== -1;
    });
    var sliceIndex = parseInt(renderKeys.length / 2);
    var topDataKeys = renderKeys.slice(0, sliceIndex);
    var bottomDataKeys = renderKeys.slice(sliceIndex); // 数据分割，得到上下堆叠的数据

    var dataTop = [],
        dataBottom = [];

    for (var i = 0; i < stackData.length; i++) {
      var itemTop = {},
          itemBottom = {};

      for (var key in stackData[i]) {
        // 计算颜色彩带数据
        if (!gradientBands.hasOwnProperty(key)) {
          gradientBands[key] = [];
        }

        gradientBands[key].push({
          color: stackColorScale(gradientDataset[i][key]),
          offset: i * step
        }); // 数据分组

        if (topDataKeys.includes(key)) {
          itemTop[key] = stackData[i][key];
        } else if (bottomDataKeys.includes(key)) {
          itemBottom[key] = stackData[i][key];
        } else {
          itemTop[key] = stackData[i][key];
          itemBottom[key] = stackData[i][key];
        }
      }

      dataTop.push(itemTop);
      dataBottom.push(itemBottom);
    }

    setStackGroup([{
      data: dataTop,
      renderKeys: topDataKeys.reverse(),
      range: [containerHeight / 2, beadConfig.height]
    }, {
      data: dataBottom,
      renderKeys: bottomDataKeys,
      range: [containerHeight / 2, containerHeight - beadConfig.height]
    }]);
    setGradient(gradientBands);
  }, [gradientData, stackData, keyword, containerHeight, beadConfig.height, stackColorScale]);
  return /*#__PURE__*/_react.default.createElement("g", {
    ref: stackBody
  }, /*#__PURE__*/_react.default.createElement("defs", null, Object.keys(gradient).map(function (key) {
    return /*#__PURE__*/_react.default.createElement(_gradient.default, {
      key: key,
      id: "stackColor_" + key,
      rule: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
      },
      gradientColors: gradient[key]
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "stack"
  }, stackGroup.map(function (_ref3, index) {
    var data = _ref3.data,
        renderKeys = _ref3.renderKeys,
        range = _ref3.range;
    var stackSeries = getSeries(data, renderKeys);
    var yScale = getScale(stackSeries, range);
    var areaScale = d3.area().x(function (d) {
      return xAxis.scale(d.data);
    }).y1(function (d) {
      return yScale(d[1]);
    }).y0(function (d) {
      return yScale(d[0]);
    }).curve(d3.curveBasis);
    return /*#__PURE__*/_react.default.createElement("g", {
      key: index
    }, stackSeries.map(function (series) {
      return /*#__PURE__*/_react.default.createElement("path", {
        key: "stack_" + series.key,
        fillOpacity: "0.3",
        fill: "url('#stackColor_" + series.key + "')",
        d: areaScale(series),
        stroke: strokeColorMap(series.key)
      });
    }));
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "beads"
  }, /*#__PURE__*/_react.default.createElement("g", {
    className: "topBeads",
    transform: "translate(0, " + (props.padding[0] + ry * 2 + 10) + ")"
  }, beadConfig.topBeadsData.map(function (datum, index) {
    var beadData = Object.keys(datum).filter(function (k) {
      return k !== xAxis.key;
    }).map(function (k) {
      return {
        key: k,
        val: datum[k],
        r: beadConfig.widthScale(datum[k])
      };
    });
    return /*#__PURE__*/_react.default.createElement(Beads, {
      type: "top",
      key: index,
      x: xAxis.scale(datum),
      y: 0,
      colorMap: beadConfig.colorMap,
      data: beadData.reverse()
    });
  })), /*#__PURE__*/_react.default.createElement("g", {
    className: "bottomBeads",
    transform: "translate(0, " + (props.height - props.padding[2] - props.padding[0] - ry * 2 + 10) + ")"
  }, beadConfig.bottomBeadsData.map(function (datum, index) {
    var beadData = Object.keys(datum).filter(function (k) {
      return k !== xAxis.key;
    }).map(function (k) {
      return {
        key: k,
        val: datum[k],
        r: beadConfig.widthScale(datum[k])
      };
    });
    return /*#__PURE__*/_react.default.createElement(Beads, {
      type: "bottom",
      key: index,
      x: xAxis.scale(datum),
      y: 0,
      colorMap: beadConfig.colorMap,
      data: beadData.reverse()
    });
  }))));
};

var _default = Stack;
exports.default = _default;