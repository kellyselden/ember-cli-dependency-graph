define('percy-web/helpers/html-safe', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var htmlSafe = Ember.String.htmlSafe;
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    return htmlSafe(params.join(''));
  });
});