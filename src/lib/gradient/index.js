"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LinearGradient = function LinearGradient(_ref) {
  var id = _ref.id,
      rule = _ref.rule,
      gradientColors = _ref.gradientColors;
  return /*#__PURE__*/_react.default.createElement("linearGradient", _extends({}, rule, {
    id: id
  }), gradientColors.map(function (gradient, i) {
    return /*#__PURE__*/_react.default.createElement("stop", {
      key: i,
      stopColor: gradient.color,
      offset: gradient.offset
    });
  }));
};

LinearGradient.propTypes = {
  id: _propTypes.default.string,
  rule: _propTypes.default.object,
  gradientColors: _propTypes.default.arrayOf(_propTypes.default.shape({
    color: _propTypes.default.string,
    offset: _propTypes.default.number
  }))
};
var _default = LinearGradient;
exports.default = _default;