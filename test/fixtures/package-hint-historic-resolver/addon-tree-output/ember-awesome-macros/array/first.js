define('ember-awesome-macros/array/first', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.normalizeArray)({}, function (array) {
    return array[0];
  });
});