define('ember-awesome-macros/and', ['exports', 'ember-awesome-macros/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.reduceKeys2)(function (value) {
    return !value;
  });
});