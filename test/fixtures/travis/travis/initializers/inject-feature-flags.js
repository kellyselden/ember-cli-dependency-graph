define('travis/initializers/inject-feature-flags', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(app) {
    var serviceName = _environment.default.featureFlagsService || 'features';
    var serviceLookupName = 'service:' + serviceName;
    app.inject('adapter', serviceName, serviceLookupName);
    app.inject('model', serviceName, serviceLookupName);
    if (_environment.default.environment === 'development') {
      // eslint-disable-next-line
      console.log('EMBER FEATURE FLAGS were auto-injected into all: routes, controllers, components, adapters and models');
    }
  }

  exports.default = {
    name: 'inject-feature-flags',
    initialize: initialize
  };
});