define('ember-composable-helpers/helpers/append', ['exports', 'ember-composable-helpers/-private/create-multi-array-helper'], function (exports, _createMultiArrayHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.append = append;

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

  var computed = Ember.computed;
  var get = Ember.get;
  var isEmberArray = Ember.isArray;
  function append() {
    for (var _len = arguments.length, dependentKeys = Array(_len), _key = 0; _key < _len; _key++) {
      dependentKeys[_key] = arguments[_key];
    }

    dependentKeys = dependentKeys || [];
    var arrayKeys = dependentKeys.map(function (dependentKey) {
      return dependentKey + '.[]';
    });

    return computed.apply(undefined, _toConsumableArray(arrayKeys).concat([function () {
      var _this = this,
          _ref;

      var array = dependentKeys.map(function (dependentKey) {
        var value = get(_this, dependentKey);
        return isEmberArray(value) ? value.toArray() : [value];
      });

      return (_ref = []).concat.apply(_ref, _toConsumableArray(array));
    }]));
  }

  exports.default = (0, _createMultiArrayHelper.default)(append);
});