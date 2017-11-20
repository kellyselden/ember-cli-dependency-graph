define('ember-awesome-macros/equal', ['exports', 'ember-macro-helpers/lazy-curried-computed'], function (exports, _lazyCurriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _lazyCurriedComputed.default)(function (get, firstKey) {
    for (var _len = arguments.length, keys = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      keys[_key - 2] = arguments[_key];
    }

    var firstVal = get(firstKey);
    for (var i = 0; i < keys.length; i++) {
      if (firstVal !== get(keys[i])) {
        return false;
      }
    }
    return true;
  });
});