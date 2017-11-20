define('liquid-fire/helpers/lf-or', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lfOr = lfOr;
  var helper = Ember.Helper.helper;
  function lfOr(params /*, hash*/) {
    return params.reduce(function (a, b) {
      return a || b;
    }, false);
  }

  exports.default = helper(lfOr);
});