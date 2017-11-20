define('ember-composable-helpers/helpers/previous', ['exports', 'ember-composable-helpers/utils/get-index', 'ember-composable-helpers/-private/create-needle-haystack-helper'], function (exports, _getIndex, _createNeedleHaystackHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.previous = previous;
  var emberArray = Ember.A;
  var isEmpty = Ember.isEmpty;
  function previous(currentValue, array) {
    var useDeepEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var currentIndex = (0, _getIndex.default)(array, currentValue, useDeepEqual);

    if (isEmpty(currentIndex)) {
      return;
    }

    return currentIndex === 0 ? currentValue : emberArray(array).objectAt(currentIndex - 1);
  }

  exports.default = (0, _createNeedleHaystackHelper.default)(previous);
});