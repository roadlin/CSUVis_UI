"use strict";

exports.__esModule = true;
exports.sliceArrayWithKey = exports.groupArrayWithKey = void 0;

/*
 * @Author: your name
 * @Date: 2020-04-17 13:22:12
 * @LastEditTime: 2020-04-28 13:28:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/lib/method.js
 */
// 按指定键值对数据进行分组
var groupArrayWithKey = function groupArrayWithKey(data, key) {
  if (data === void 0) {
    data = [{}];
  }

  if (key === void 0) {
    key = '';
  }

  var result = [],
      tempResult = {}; // 获取该 key 值有多少种类型

  data.forEach(function (item) {
    if (!tempResult[item[key]]) {
      tempResult[item[key]] = [];
    }

    tempResult[item[key]].push(item);
  }); // 将对象转换为数组

  for (var name in tempResult) {
    if (tempResult.hasOwnProperty(name)) {
      result.push(tempResult[name]);
    }
  }

  return result;
}; // 根据某一个 key 值，对连续数据进行分片 


exports.groupArrayWithKey = groupArrayWithKey;

var sliceArrayWithKey = function sliceArrayWithKey(data, key, thd) {
  if (data === void 0) {
    data = [];
  }

  if (key === void 0) {
    key = '';
  }

  if (thd === void 0) {
    thd = 1;
  }

  var slices = [],
      slice = [];

  for (var i = 0; i < data.length; i++) {
    slice.push(data[i]); // 当前后两个值相差大于阈值时则该断开

    if (i >= data.length - 1 || Math.abs(data[i + 1][key] - data[i][key]) > thd) {
      slices.push(slice);
      slice = [];
    }
  }

  return slices;
};

exports.sliceArrayWithKey = sliceArrayWithKey;