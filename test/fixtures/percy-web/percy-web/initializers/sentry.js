define('percy-web/initializers/sentry', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* application */{
    Raven.config(_environment.default.APP.SENTRY_URL).addPlugin(Raven.Plugins.Ember).install();
  }

  exports.default = {
    name: 'sentry',
    initialize: initialize
  };
});