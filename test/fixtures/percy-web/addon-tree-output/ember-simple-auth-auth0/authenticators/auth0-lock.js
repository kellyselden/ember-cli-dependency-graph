define('ember-simple-auth-auth0/authenticators/auth0-lock', ['exports', 'ember', 'ember-simple-auth-auth0/authenticators/auth0-base'], function (exports, _ember, _emberSimpleAuthAuth0AuthenticatorsAuth0Base) {
  var get = _ember['default'].get;
  var service = _ember['default'].inject.service;
  exports['default'] = _emberSimpleAuthAuth0AuthenticatorsAuth0Base['default'].extend({
    auth0: service(),
    authenticate: function authenticate(options) {
      return get(this, 'auth0').showLock(options);
    }
  });
});