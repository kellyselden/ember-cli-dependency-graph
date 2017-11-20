define('travis/helpers/travis-mb', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (size) {
    if (size) {
      return (size / 1024 / 1024).toFixed(2);
    }
  });
});