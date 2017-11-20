define('ember-truth-helpers/helpers/not', ['exports', 'ember-truth-helpers/utils/truth-convert'], function (exports, _truthConvert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.not = not;
  var helper = Ember.Helper.helper;
  function not(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if ((0, _truthConvert.default)(params[i]) === true) {
        return false;
      }
    }
    return true;
  }

  exports.default = helper(not);
});