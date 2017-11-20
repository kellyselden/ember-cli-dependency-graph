define('ember-awesome-macros/string/underscore', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var underscore = Ember.String.underscore;
  exports.default = (0, _utils.normalizeString)(underscore);
});