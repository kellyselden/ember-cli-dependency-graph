define('ember-awesome-macros/product', ['exports', 'ember-awesome-macros/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.reduceKeys)(function (total, value) {
    return total * value;
  });
});