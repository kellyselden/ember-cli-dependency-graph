define('ember-simple-auth/initializers/setup-session', ['exports', 'ember-simple-auth/internal-session', 'ember-simple-auth/session-stores/ephemeral', 'ember-simple-auth/utils/inject'], function (exports, _internalSession, _ephemeral, _inject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = setupSession;
  function setupSession(registry) {
    registry.register('session:main', _internalSession.default);

    var store = 'session-store:application';
    if (Ember.testing) {
      store = 'session-store:test';
      registry.register(store, _ephemeral.default);
    }

    (0, _inject.default)(registry, 'session:main', 'store', store);
  }
});