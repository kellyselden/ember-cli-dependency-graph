define('vertical-collection/-debug/utils/validate-rect', ['exports', 'vertical-collection/-debug/utils/validate-style'], function (exports, _validateStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasDimension = hasDimension;
  exports.hasDimensionAbove = hasDimensionAbove;
  exports.hasDimensionEqual = hasDimensionEqual;
  function hasDimension(rect, prop) {
    return (0, _validateStyle.isNonZero)(rect[prop]);
  }

  function hasDimensionAbove(rect, prop, amount) {
    return hasDimension(rect, prop) && rect[prop] >= amount;
  }

  function hasDimensionEqual(rect, prop, amount) {
    return hasDimension(rect, prop) && rect[prop] === amount;
  }
});