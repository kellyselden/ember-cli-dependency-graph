define('ember-composable-helpers/utils/get-index', ['exports', 'ember-composable-helpers/utils/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getIndex;
  var emberArray = Ember.A;
  function getIndex(array, currentValue, useDeepEqual) {
    var needle = currentValue;

    if (useDeepEqual) {
      needle = emberArray(array).find(function (object) {
        return (0, _isEqual.default)(object, currentValue, useDeepEqual);
      });
    }

    var index = emberArray(array).indexOf(needle);

    return index >= 0 ? index : null;
  }
});