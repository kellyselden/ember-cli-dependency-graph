define('ember-awesome-macros/string/capitalize', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var capitalize = Ember.String.capitalize;
  exports.default = (0, _utils.normalizeString)(capitalize);
});