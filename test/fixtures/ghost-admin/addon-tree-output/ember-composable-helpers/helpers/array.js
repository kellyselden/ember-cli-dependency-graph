define('ember-composable-helpers/helpers/array', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.array = array;
  var helper = Ember.Helper.helper;
  var emberArray = Ember.A;
  function array() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    // slice params to avoid mutating the provided params
    return emberArray(params.slice());
  }

  exports.default = helper(array);
});