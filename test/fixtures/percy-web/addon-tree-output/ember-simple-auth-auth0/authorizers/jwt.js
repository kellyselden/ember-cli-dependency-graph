define('ember-simple-auth-auth0/authorizers/jwt', ['exports', 'ember', 'ember-simple-auth/authorizers/base'], function (exports, _ember, _emberSimpleAuthAuthorizersBase) {
  var isPresent = _ember['default'].isPresent;
  var debug = _ember['default'].debug;
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
    authorize: function authorize(sessionData, block) {
      var userToken = sessionData['idToken'];

      if (isPresent(userToken)) {
        block('Authorization', 'Bearer ' + userToken);
      } else {
        debug('Could not find the authorization token in the session data for the jwt authorizer.');
      }
    }
  });
});