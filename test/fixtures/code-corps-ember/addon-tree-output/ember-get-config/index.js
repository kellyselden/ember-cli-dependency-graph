define('ember-get-config/index', ['exports', 'code-corps-ember/config/environment'], function (exports, _codeCorpsEmberConfigEnvironment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _codeCorpsEmberConfigEnvironment['default'];
    }
  });
});