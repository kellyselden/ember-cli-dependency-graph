define('ember-composable-helpers/helpers/without', ['exports', 'ember-composable-helpers/-private/create-needle-haystack-helper', 'ember-composable-helpers/utils/includes'], function (exports, _createNeedleHaystackHelper, _includes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.without = without;
  var emberArray = Ember.A;
  var isEmberArray = Ember.isArray;
  var get = Ember.get;
  var typeOf = Ember.typeOf;


  function contains(needle, haystack) {
    return (0, _includes.default)(emberArray(haystack), needle);
  }

  function without(needle, haystack) {
    if (!isEmberArray(haystack)) {
      return false;
    }

    if (typeOf(needle) === 'array' && get(needle, 'length')) {
      return haystack.reduce(function (acc, val) {
        return contains(val, needle) ? acc : acc.concat(val);
      }, []);
    }

    return emberArray(haystack).without(needle);
  }

  exports.default = (0, _createNeedleHaystackHelper.default)(without);
});