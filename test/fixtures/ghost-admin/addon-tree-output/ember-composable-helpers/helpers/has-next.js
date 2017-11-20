define('ember-composable-helpers/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/next', 'ember-composable-helpers/-private/create-needle-haystack-helper', 'ember-composable-helpers/utils/is-equal'], function (exports, _next, _createNeedleHaystackHelper, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasNext = hasNext;
  var isPresent = Ember.isPresent;
  function hasNext(currentValue, array) {
    var useDeepEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var nextValue = (0, _next.next)(currentValue, array, useDeepEqual);
    var isNotSameValue = !(0, _isEqual.default)(nextValue, currentValue, useDeepEqual);

    return isNotSameValue && isPresent(nextValue);
  }

  exports.default = (0, _createNeedleHaystackHelper.default)(hasNext);
});