define('ember-awesome-macros/string/html-safe', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var htmlSafe = Ember.String.htmlSafe;
  exports.default = (0, _utils.normalizeString)(htmlSafe);
});