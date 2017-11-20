define('ember-awesome-macros/string/-utils', ['exports', 'ember-macro-helpers/curried-computed', 'ember-macro-helpers/lazy-curried-computed'], function (exports, _curriedComputed, _lazyCurriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.normalizeString = normalizeString;
  exports.normalizeString2 = normalizeString2;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function normalizeString(func) {
    return (0, _curriedComputed.default)(function (val) {
      if (!val) {
        return val;
      }

      return func(val);
    });
  }

  function normalizeString2(func) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    return (0, _lazyCurriedComputed.default)(function (get, stringKey) {
      for (var _len = arguments.length, keys = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        keys[_key - 2] = arguments[_key];
      }

      var stringVal = get(stringKey);
      if (stringVal === undefined) {
        return defaultValue();
      }

      return stringVal[func].apply(stringVal, _toConsumableArray(keys.map(get)));
    });
  }
});