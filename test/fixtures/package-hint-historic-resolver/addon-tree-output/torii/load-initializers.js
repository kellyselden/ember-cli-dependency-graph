define('torii/load-initializers', ['exports', 'torii/lib/load-initializer', 'torii/lib/load-instance-initializer', 'torii/initializers/initialize-torii', 'torii/initializers/initialize-torii-callback', 'torii/initializers/initialize-torii-session', 'torii/instance-initializers/setup-routes', 'torii/instance-initializers/walk-providers'], function (exports, _loadInitializer, _loadInstanceInitializer, _initializeTorii, _initializeToriiCallback, _initializeToriiSession, _setupRoutes, _walkProviders) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    (0, _loadInitializer.default)(_initializeToriiCallback.default);
    (0, _loadInitializer.default)(_initializeTorii.default);
    (0, _loadInitializer.default)(_initializeToriiSession.default);
    (0, _loadInstanceInitializer.default)(_walkProviders.default);
    (0, _loadInstanceInitializer.default)(_setupRoutes.default);
  };
});