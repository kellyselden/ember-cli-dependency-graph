define('ember-awesome-macros/string/dasherize', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dasherize = Ember.String.dasherize;
  exports.default = (0, _utils.normalizeString)(dasherize);
});