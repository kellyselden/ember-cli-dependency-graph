define('ember-simple-auth-auth0/authenticators/auth0-base', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  var RSVP = _ember['default'].RSVP;
  var service = _ember['default'].inject.service;
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    auth0: service(),
    restore: function restore(data) {
      return RSVP.resolve(data);
    }
  });
});