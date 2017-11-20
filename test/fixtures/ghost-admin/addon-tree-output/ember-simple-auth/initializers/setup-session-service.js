define('ember-simple-auth/initializers/setup-session-service', ['exports', 'ember-simple-auth/utils/inject'], function (exports, _inject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = setupSessionStore;
  function setupSessionStore(registry) {
    (0, _inject.default)(registry, 'service:session', 'session', 'session:main');
  }
});