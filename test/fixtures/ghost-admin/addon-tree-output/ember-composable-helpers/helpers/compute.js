define('ember-composable-helpers/helpers/compute', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.compute = compute;

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

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var helper = Ember.Helper.helper;
  function compute(_ref) {
    var _ref2 = _toArray(_ref),
        action = _ref2[0],
        params = _ref2.slice(1);

    return action.apply(undefined, _toConsumableArray(params));
  }

  exports.default = helper(compute);
});