define('ember-awesome-macros/gte', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _curriedComputed.default)(function (val1, val2) {
    return val1 >= val2;
  });
});