define('ember-truth-helpers/helpers/is-array', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isArray = isArray;
  var helper = Ember.Helper.helper;
  var emberIsArray = Ember.isArray;
  function isArray(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if (emberIsArray(params[i]) === false) {
        return false;
      }
    }
    return true;
  }

  exports.default = helper(isArray);
});