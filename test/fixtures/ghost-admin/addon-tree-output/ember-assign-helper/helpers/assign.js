define('ember-assign-helper/helpers/assign', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.assign = assign;

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

  var eAssign = Ember.assign || Object.assign;

  function assign(params) {
    return eAssign.apply(undefined, [{}].concat(_toConsumableArray(params)));
  }

  exports.default = Ember.Helper.helper(assign);
});