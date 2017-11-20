define('ember-simple-auth/initializers/setup-session-service', ['exports', 'ember-simple-auth/utils/inject'], function (exports, _emberSimpleAuthUtilsInject) {
  exports['default'] = setupSessionStore;

  function setupSessionStore(registry) {
    (0, _emberSimpleAuthUtilsInject['default'])(registry, 'service:session', 'session', 'session:main');
  }
});