define('ember-awesome-macros/conditional', ['exports', 'ember-macro-helpers/lazy-curried-computed'], function (exports, _lazyCurriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _lazyCurriedComputed.default)(function (get, condition, expr1, expr2) {
    return get(condition) ? get(expr1) : get(expr2);
  });
});