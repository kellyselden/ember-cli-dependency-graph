define('ember-composable-helpers/helpers/contains', ['exports', 'ember-composable-helpers/-private/create-needle-haystack-helper', 'ember-composable-helpers/utils/includes'], function (exports, _createNeedleHaystackHelper, _includes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.contains = contains;
  var emberArray = Ember.A;
  var get = Ember.get;
  var isEmberArray = Ember.isArray;


  function _contains(needle, haystack) {
    return (0, _includes.default)(emberArray(haystack), needle);
  }

  function contains(needle, haystack) {
    if (!isEmberArray(haystack)) {
      return false;
    }

    if (isEmberArray(needle) && get(needle, 'length')) {
      return needle.reduce(function (acc, val) {
        return acc && _contains(val, haystack);
      }, true);
    }

    return _contains(needle, haystack);
  }

  exports.default = (0, _createNeedleHaystackHelper.default)(contains);
});