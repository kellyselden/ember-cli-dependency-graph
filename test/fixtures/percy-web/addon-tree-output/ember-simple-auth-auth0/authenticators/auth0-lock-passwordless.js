define('ember-simple-auth-auth0/authenticators/auth0-lock-passwordless', ['exports', 'ember', 'ember-simple-auth-auth0/authenticators/auth0-base'], function (exports, _ember, _emberSimpleAuthAuth0AuthenticatorsAuth0Base) {
  var get = _ember['default'].get;
  var service = _ember['default'].inject.service;
  var RSVP = _ember['default'].RSVP;
  var typeOf = _ember['default'].typeOf;
  exports['default'] = _emberSimpleAuthAuth0AuthenticatorsAuth0Base['default'].extend({
    auth0: service(),
    authenticate: function authenticate(type, options, callback) {
      if (typeOf(options) === 'function') {
        callback = options;
        options = {};
      }

      get(this, 'auth0').showPasswordlessLock(type, options).then(callback);
      // NOTE: Always reject here so that the developer can use the proxied callback without being redirected to an authenticated state.
      // Which is the default behavior.
      return RSVP.reject();
    }
  });
});