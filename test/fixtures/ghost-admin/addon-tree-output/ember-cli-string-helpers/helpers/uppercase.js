define('ember-cli-string-helpers/helpers/uppercase', ['exports', 'ember-cli-string-helpers/utils/uppercase', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _uppercase, _createStringHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.uppercase = undefined;
  var helper = Ember.Helper.helper;
  var uppercase = exports.uppercase = (0, _createStringHelper.default)(_uppercase.default);
  exports.default = helper(uppercase);
});