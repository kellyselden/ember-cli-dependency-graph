define('ember-awesome-macros/string/classify', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var classify = Ember.String.classify;
  exports.default = (0, _utils.normalizeString)(classify);
});