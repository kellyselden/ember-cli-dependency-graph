define('ember-get-config/index', ['exports', 'ghost-admin/config/environment'], function (exports, _ghostAdminConfigEnvironment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _ghostAdminConfigEnvironment['default'];
    }
  });
});