define('ember-awesome-macros/array/reduce', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.normalizeArray)({}, function (array, callback, initialValue) {
    if (typeof initialValue === 'function') {
      initialValue = initialValue();
    }
    return array.reduce(callback, initialValue);
  });
});