define('ember-awesome-macros/string/is-html-safe', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isHTMLSafe = Ember.String.isHTMLSafe;
  exports.default = (0, _utils.normalizeString)(isHTMLSafe);
});