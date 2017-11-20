define('ember-simple-auth-token/utils/load-config', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = function (defaults) {
    return function (container, config) {
      var wrappedConfig = _ember['default'].Object.create(config);

      for (var property in this) {
        if (this.hasOwnProperty(property) && _ember['default'].typeOf(this[property]) !== 'function') {
          this[property] = wrappedConfig.getWithDefault(property, defaults[property]);
        }
      }
    };
  };
});