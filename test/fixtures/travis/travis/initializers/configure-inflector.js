define('travis/initializers/configure-inflector', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var initializer = {
    name: 'inflector',

    initialize: function initialize() {
      var inflector = Ember.Inflector.inflector;
      inflector.uncountable('permissions');
      inflector.irregular('cache', 'caches');
    }
  };

  if (_environment.default.environment !== 'production') {
    initializer.before = 'ember-cli-mirage';
  }

  exports.default = initializer;
});