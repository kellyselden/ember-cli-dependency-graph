define("vertical-collection/-debug/utils/validate-style", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasStyleValue = hasStyleValue;
  exports.isNonZero = isNonZero;
  exports.hasStyleWithNonZeroValue = hasStyleWithNonZeroValue;
  exports.styleIsOneOf = styleIsOneOf;
  exports.containsStyleValue = containsStyleValue;
  function hasStyleValue(styles, key, value) {
    return styles[key] === value;
  }

  function isNonZero(value) {
    var int = parseInt(value, 10);
    var float = parseFloat(value);

    return !isNaN(int) && (int !== 0 || float !== 0);
  }

  function hasStyleWithNonZeroValue(styles, key) {
    return isNonZero(styles[key]);
  }

  function styleIsOneOf(styles, key, values) {
    return styles[key] && values.indexOf(styles[key]) !== -1;
  }

  function containsStyleValue(styles, key, value) {
    return styles[key] && styles[key].indexOf(value) !== -1;
  }
});