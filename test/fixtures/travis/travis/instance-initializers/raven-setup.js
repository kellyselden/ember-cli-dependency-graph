define('travis/instance-initializers/raven-setup', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    if (Ember.get(_environment.default, 'sentry.development') === true) {
      if (Ember.get(_environment.default, 'sentry.debug') === true) {
        Ember.Logger.info('`sentry` is configured for development mode.');
      }
      return;
    }

    if (!_environment.default.sentry) {
      throw new Error('`sentry` should be configured when not in development mode.');
    }

    var _config$sentry$servic = _environment.default.sentry.serviceName,
        serviceName = _config$sentry$servic === undefined ? 'raven' : _config$sentry$servic;

    var lookupName = 'service:' + serviceName;
    var service = application.lookup ? application.lookup(lookupName) : application.container.lookup(lookupName);

    service.setup(_environment.default);
  }

  exports.default = {
    initialize: initialize,
    name: 'sentry-setup'
  };
});