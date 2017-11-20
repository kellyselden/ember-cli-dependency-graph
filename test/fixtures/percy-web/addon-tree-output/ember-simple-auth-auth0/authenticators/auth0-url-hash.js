define('ember-simple-auth-auth0/authenticators/auth0-url-hash', ['exports', 'ember', 'ember-simple-auth-auth0/authenticators/auth0-base', 'ember-simple-auth-auth0/utils/create-session-data-object'], function (exports, _ember, _emberSimpleAuthAuth0AuthenticatorsAuth0Base, _emberSimpleAuthAuth0UtilsCreateSessionDataObject) {
  var RSVP = _ember['default'].RSVP;
  var get = _ember['default'].get;
  var service = _ember['default'].inject.service;
  var isEmpty = _ember['default'].isEmpty;
  exports['default'] = _emberSimpleAuthAuth0AuthenticatorsAuth0Base['default'].extend({
    auth0: service(),
    session: service(),
    authenticate: function authenticate(urlHashData) {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        if (isEmpty(urlHashData)) {
          reject();
        }
        var auth0 = get(_this, 'auth0').getAuth0Instance();
        var getUserInfo = function getUserInfo() {};

        // Handle auth0.js v8.x.x
        if (get(_this, 'auth0.isGreaterThanVersion8')) {
          getUserInfo = auth0.client.userInfo.bind(auth0.client);
        } else {
          getUserInfo = auth0.getUserInfo.bind(auth0);
        }

        getUserInfo(urlHashData.accessToken, function (err, profile) {
          if (err) {
            return reject(err);
          }

          resolve((0, _emberSimpleAuthAuth0UtilsCreateSessionDataObject['default'])(profile, urlHashData));
        });
      });
    }
  });
});