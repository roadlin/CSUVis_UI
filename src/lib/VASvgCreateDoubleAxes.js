"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _vaSvg = _interopRequireDefault(require("./vaSvg"));

var d3 = _interopRequireWildcard(require("d3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import useSize from '../hooks/useSize'
// import useClientRect from '../hooks/useClientRect'
function NewComp(Comp, viewboxId, config) {
  // 参数默认值，便于兜错
  var props = {
    xAxis: {
      type: 'number',
      domain: [1, 1],
      formatFn: function formatFn(d) {
        return d;
      },
      scaleFn: d3.scaleLinear,
      isShow: false,
      holdTicks: false,
      showPath: true
    },
    yAxis: []
  };
  Object.assign(props, config); // 逻辑功能部分

  var width = props.width,
      height = props.height,
      padding = props.padding,
      xAxis = props.xAxis,
      yAxis = props.yAxis;
  var svg = (0, _react.useRef)();

  var _useState = (0, _react.useState)(xAxis.domain),
      xDomain = _useState[0],
      setXDomain = _useState[1];

  var _useState2 = (0, _react.useState)(yAxis.map(function (y) {
    return y.domain;
  })),
      yDomain = _useState2[0],
      setYDomain = _useState2[1]; // 由于坐标系可能是日期，日期在 js 中为对象，在 useEffect 中不会迭代比较对象是否相等，因此需要转换为数值数组
  // 且在 useEffect 依赖项时需要拆分为多个元素


  var xNumber = xAxis.domain.map(function (i) {
    return Number(i);
  });
  var yNumber = yAxis.reduce(function (combine, y) {
    return combine.concat(y.domain.map(function (i) {
      return Number(i);
    }));
  }, []); // const [rect, container] = useClientRect()
  // const {width, height} = rect
  // console.log(rect)

  var updateScale = function updateScale(scale, config) {
    return function (d) {
      return scale(config.type === 'date' ? new Date(d[config.key]) : d[config.key]);
    };
  }; // 比例尺


  var xRange = [0, width - padding[1] - padding[3]];
  var yRange = yAxis.map(function (y) {
    return y.range ? y.range.map(function (range) {
      return range - padding[0];
    }) : [height - padding[2] - padding[0], 0];
  });
  var x = xAxis.scaleFn().domain(xDomain).range(xRange);
  var y = yAxis.map(function (y, i) {
    return y.scaleFn().domain(yDomain[i]).range(yRange[i]);
  });
  var xScale = updateScale(x, xAxis);
  var yScale = yAxis.map(function (yConfig, i) {
    return updateScale(y[i], yAxis[i]);
  }); // 悬浮框交互
  // 创建悬浮框

  var createTooltip = function createTooltip(x, y, msg) {
    var tooltip = document.getElementById('tooltip');

    if (tooltip) {
      tooltip.innerHTML = msg;
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";

      if (tooltip.style.display !== 'block') {
        tooltip.style.display = 'block';
      }

      return;
    }

    var oDiv = document.createElement('div');
    oDiv.id = 'tooltip';
    oDiv.innerHTML = msg;
    oDiv.style.position = 'absolute';
    oDiv.style.left = x + "px";
    oDiv.style.top = y + "px";
    oDiv.style.borderRadius = '5px';
    oDiv.style.backgroundColor = 'rgba(50, 50, 50, .8)';
    oDiv.style.color = '#fff';
    oDiv.style.fontSize = '12px';
    oDiv.style.padding = '5px';
    oDiv.style.minWidth = '100px';
    document.body.appendChild(oDiv);
  }; // 移除悬浮框


  var removeTooltip = function removeTooltip() {
    var tooltip = document.getElementById('tooltip');

    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }; // 缩放事件


  (0, _react.useEffect)(function () {
    var canvas = svg.current;

    if (props.enableZoom) {
      var zoomed = function zoomed() {
        var transform = d3.event.transform;
        var zx = transform.rescaleX(x).interpolate(d3.interpolateRound).domain();
        var zy = y.map(function (scale) {
          return transform.rescaleY(scale).interpolate(d3.interpolateRound).domain();
        });
        props.enableZoom.x && setXDomain(xAxis.type === 'number' ? zx.map(function (d) {
          return d.toFixed(2);
        }) : zx);
        props.enableZoom.y && setYDomain(zy.map(function (domains, i) {
          return yAxis[i].type === 'number' ? domains.map(function (d) {
            return d.toFixed(2);
          }) : domains;
        }));
        props.enableZoom.cb && props.enableZoom.cb(zx, zy);
      };

      var zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', zoomed);
      d3.select(canvas).call(zoom).call(zoom.transform, d3.zoomIdentity);
    } // 移除事件


    return function () {
      return d3.select(canvas).on('.zoom', null);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.enableZoom]); // 这里不将 x y 作为依赖传入，否则会出错，陷入无尽的循环渲染
  // 更新坐标轴

  (0, _react.useEffect)(function () {
    setXDomain(xAxis.domain);
    setYDomain(yAxis.map(function (y) {
      return y.domain;
    })); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [].concat(xNumber, yNumber));

  var newProps = _objectSpread({}, props); // 内置了数据类型转换的比例尺


  newProps.xAxis.scale = xScale;
  newProps.yAxis = props.yAxis.map(function (y, i) {
    return _objectSpread(_objectSpread({}, y), {}, {
      scale: yScale[i],
      scaleCore: y[i]
    });
  }); // 核心比例尺方法，可以用于获取 range，domain 等信息

  newProps.xAxis.scaleCore = x;
  newProps.viewName = viewboxId;
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_vaSvg.default, {
    width: width,
    height: height,
    padding: padding,
    xAxis: _objectSpread(_objectSpread({}, xAxis), {}, {
      domain: xDomain,
      initDomain: xAxis.domain
    }),
    yAxis: yAxis.map(function (y, i) {
      return _objectSpread(_objectSpread({}, y), {}, {
        domain: yDomain[i],
        initDomain: y.domain
      });
    }),
    viewboxId: viewboxId,
    refObj: svg
  }, /*#__PURE__*/_react.default.createElement(Comp, _extends({}, newProps, {
    updateScale: updateScale,
    showTooltip: createTooltip,
    hideTooltip: removeTooltip
  }))));
}

function VASvgCreate(Comp, viewboxId) {
  return function (props) {
    return NewComp(Comp, viewboxId, props);
  };
}

var _default = VASvgCreate;
exports.default = _default;