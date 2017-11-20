define('percy-web/helpers/format-currency', ['exports', 'percy-web/lib/formatting'], function (exports, _formatting) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (value, options) {
    return _formatting.default.formatCurrency(value, options.hash);
  });
});