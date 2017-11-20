define('ember-awesome-macros/string/camelize', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var camelize = Ember.String.camelize;
  exports.default = (0, _utils.normalizeString)(camelize);
});