define('ember-truth-helpers/helpers/equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.equal = equal;
  var helper = Ember.Helper.helper;
  function equal(params) {
    return params[0] === params[1];
  }

  exports.default = helper(equal);
});