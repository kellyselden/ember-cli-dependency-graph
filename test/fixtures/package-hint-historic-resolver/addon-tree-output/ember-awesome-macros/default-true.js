define('ember-awesome-macros/default-true', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _curriedComputed.default)(function (val) {
    return val === undefined ? true : val;
  });
});