define('travis/initializers/ember-feature-flags', ['exports', 'travis/config/environment', 'travis/services/features'], function (exports, _environment, _features) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    var serviceName = _environment.default.featureFlagsService || 'features';
    var serviceLookupName = 'service:' + serviceName;

    application.register(serviceLookupName, _features.default);
    application.inject('route', serviceName, serviceLookupName);
    application.inject('controller', serviceName, serviceLookupName);
    application.inject('component', serviceName, serviceLookupName);
    application.inject(serviceLookupName, 'application', 'application:main');
  }

  exports.default = {
    name: 'ember-feature-flags',
    initialize: initialize
  };
});