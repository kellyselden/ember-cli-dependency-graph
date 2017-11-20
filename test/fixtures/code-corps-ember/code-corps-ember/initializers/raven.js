define('code-corps-ember/initializers/raven', ['exports', 'code-corps-ember/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    var _config$sentry$servic = _environment.default.sentry.serviceName,
        serviceName = _config$sentry$servic === undefined ? 'raven' : _config$sentry$servic;

    var lookupName = 'service:' + serviceName;
    var _config$sentry$expose = _environment.default.sentry.exposedPropertyName,
        exposedPropertyName = _config$sentry$expose === undefined ? 'raven' : _config$sentry$expose;


    application.inject('route', exposedPropertyName, lookupName);
    application.inject('component', exposedPropertyName, lookupName);
    application.inject('controller', exposedPropertyName, lookupName);
    application.inject('model', exposedPropertyName, lookupName);
  }

  exports.default = {
    initialize: initialize,
    name: 'raven'
  };
});