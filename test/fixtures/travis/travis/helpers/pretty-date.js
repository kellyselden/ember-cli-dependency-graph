define('travis/helpers/pretty-date', ['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var htmlSafe = Ember.String.htmlSafe;
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    var date = new Date(params[0]);
    return new htmlSafe((0, _moment.default)(date).format('MMMM D, YYYY H:mm:ss') || '-');
  });
});