define('ember-composable-helpers/helpers/next', ['exports', 'ember-composable-helpers/utils/get-index', 'ember-composable-helpers/-private/create-needle-haystack-helper'], function (exports, _getIndex, _createNeedleHaystackHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.next = next;
  var emberArray = Ember.A;
  var get = Ember.get,
      isEmpty = Ember.isEmpty;
  function next(currentValue, array) {
    var useDeepEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var currentIndex = (0, _getIndex.default)(array, currentValue, useDeepEqual);
    var lastIndex = get(array, 'length') - 1;

    if (isEmpty(currentIndex)) {
      return;
    }

    return currentIndex === lastIndex ? currentValue : emberArray(array).objectAt(currentIndex + 1);
  }

  exports.default = (0, _createNeedleHaystackHelper.default)(next);
});