define('ember-get-config/index', ['exports', 'percy-web/config/environment'], function (exports, _percyWebConfigEnvironment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _percyWebConfigEnvironment['default'];
    }
  });
});