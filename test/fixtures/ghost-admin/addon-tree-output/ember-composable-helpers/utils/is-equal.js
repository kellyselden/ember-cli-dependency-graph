define('ember-composable-helpers/utils/is-equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEqual;
  var emberIsEqual = Ember.isEqual;
  function isEqual(firstValue, secondValue) {
    var useDeepEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (useDeepEqual) {
      return JSON.stringify(firstValue) === JSON.stringify(secondValue);
    } else {
      return emberIsEqual(firstValue, secondValue) || emberIsEqual(secondValue, firstValue);
    }
  }
});