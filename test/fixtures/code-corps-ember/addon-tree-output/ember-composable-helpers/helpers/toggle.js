define('ember-composable-helpers/helpers/toggle', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.toggle = toggle;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var helper = Ember.Helper.helper;
  var get = Ember.get;
  var set = Ember.set;
  var isPresent = Ember.isPresent;


  function nextIndex(length, currentIdx) {
    if (currentIdx === -1 || currentIdx + 1 === length) {
      return 0;
    }

    return currentIdx + 1;
  }

  function toggle(_ref) {
    var _ref2 = _toArray(_ref),
        prop = _ref2[0],
        obj = _ref2[1],
        values = _ref2.slice(2);

    return function () {
      var currentValue = get(obj, prop);

      if (isPresent(values)) {
        var currentIdx = values.indexOf(currentValue);
        var nextIdx = nextIndex(get(values, 'length'), currentIdx);

        return set(obj, prop, values[nextIdx]);
      }

      return set(obj, prop, !currentValue);
    };
  }

  exports.default = helper(toggle);
});