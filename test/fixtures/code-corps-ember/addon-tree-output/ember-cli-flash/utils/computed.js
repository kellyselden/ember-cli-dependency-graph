define('ember-cli-flash/utils/computed', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.add = add;
  exports.guidFor = guidFor;
  var typeOf = Ember.typeOf,
      _get = Ember.get,
      computed = Ember.computed,
      emberGuidFor = Ember.guidFor,
      emberArray = Ember.A;
  function add() {
    for (var _len = arguments.length, dependentKeys = Array(_len), _key = 0; _key < _len; _key++) {
      dependentKeys[_key] = arguments[_key];
    }

    var computedFunc = computed({
      get: function get() {
        var _this = this;

        var values = dependentKeys.map(function (dependentKey) {
          var value = _get(_this, dependentKey);

          if (typeOf(value) !== 'number') {
            return;
          }

          return value;
        });

        return emberArray(values).compact().reduce(function (prev, curr) {
          return prev + curr;
        });
      }
    });

    return computedFunc.property.apply(computedFunc, dependentKeys);
  }

  function guidFor(dependentKey) {
    return computed(dependentKey, {
      get: function get() {
        var value = _get(this, dependentKey);

        return emberGuidFor(value.toString());
      }
    });
  }
});