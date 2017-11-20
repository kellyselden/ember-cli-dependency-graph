define('ember-simple-auth-auth0/services/auth0', ['exports', 'ember', 'auth0', 'auth0-lock', 'auth0-lock-passwordless', 'ember-simple-auth-auth0/utils/create-session-data-object', 'ember-simple-auth-auth0/utils/semver'], function (exports, _ember, _auth0, _auth0Lock, _auth0LockPasswordless, _emberSimpleAuthAuth0UtilsCreateSessionDataObject, _emberSimpleAuthAuth0UtilsSemver) {
  var Service = _ember['default'].Service;
  var computed = _ember['default'].computed;
  var readOnly = _ember['default'].computed.readOnly;
  var deprecate = _ember['default'].deprecate;
  var _get = _ember['default'].get;
  var getOwner = _ember['default'].getOwner;
  var getProperties = _ember['default'].getProperties;
  var assert = _ember['default'].assert;
  var testing = _ember['default'].testing;
  var isEmpty = _ember['default'].isEmpty;
  var service = _ember['default'].inject.service;
  var RSVP = _ember['default'].RSVP;

  var assign = _ember['default'].assign || _ember['default'].merge;

  var validPasswordlessTypes = ['sms', 'magiclink', 'emailcode'];

  exports['default'] = Service.extend({
    session: service(),
    /**
     * The env config found in the environment config.
     * ENV['ember-simple-auth'].auth0
     *
     * @type {Object}
     */
    config: computed({
      get: function get() {
        var emberSimpleAuthConfig = _get(this, '_environmentConfig')['ember-simple-auth'];
        assert('ember-simple-auth config must be defined', emberSimpleAuthConfig);
        assert('ember-simple-auth.auth0 config must be defined', emberSimpleAuthConfig.auth0);

        return emberSimpleAuthConfig.auth0;
      }
    }),

    /**
     * The Auth0 App ClientID found in your Auth0 dashboard
     * @type {String}
     */
    clientID: readOnly('config.clientID'),

    /**
     * The Auth0 App Domain found in your Auth0 dashboard
     * @type {String}
     */
    domain: readOnly('config.domain'),

    isGreaterThanVersion8: computed(function () {
      return (0, _emberSimpleAuthAuth0UtilsSemver['default'])(_get(this, '_auth0.version'), '8.0.0') > 0;
    }),

    logoutReturnToURL: readOnly('config.logoutReturnToURL'),

    showLock: function showLock(options) {
      var _this = this;

      var clientID = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var domain = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      deprecate('The current default options being passed into lock will no longer be passed in by default you will need to explicitly set them.', false, {
        id: 'ember-simple-auth-auth0',
        until: 'v4.0.0'
      });

      var defaultOptions = {
        autoclose: true,
        auth: {
          redirect: false,
          params: {
            scope: 'openid'
          }
        }
      };

      options = assign(defaultOptions, options);

      return new RSVP.Promise(function (resolve, reject) {
        var lock = _this.getAuth0LockInstance(options, clientID, domain);
        _this._setupLock(lock, resolve, reject);
        lock.show();
      });
    },

    showPasswordlessLock: function showPasswordlessLock(type, options) {
      var _this2 = this;

      var clientID = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var domain = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      assert('You must pass in a valid type to auth0-lock-passwordless authenticator. Valid types: ' + validPasswordlessTypes.toString(), validPasswordlessTypes.indexOf(type) > -1);

      var defaultOptions = {
        auth: {
          params: {
            scope: 'openid'
          },
          audience: '' + clientID
        }
      };

      options = assign(defaultOptions, options);

      return new RSVP.Promise(function (resolve) {
        var lock = _this2.getAuth0LockPasswordlessInstance(clientID, domain);
        lock[type](options, function () {
          return resolve.apply(undefined, arguments);
        });
      });
    },

    _setupLock: function _setupLock(lock, resolve, reject) {
      lock.on('unrecoverable_error', reject);
      lock.on('authorization_error', reject);

      // lock.on('hash_parsed', resolve);
      lock.on('authenticated', function (authenticatedData) {
        if (isEmpty(authenticatedData)) {
          return reject(new Error('The authenticated data did not come back from the request'));
        }

        lock.getProfile(authenticatedData.idToken, function (error, profile) {
          if (error) {
            return reject(error);
          }

          resolve((0, _emberSimpleAuthAuth0UtilsCreateSessionDataObject['default'])(profile, authenticatedData));
        });
      });
    },

    getAuth0LockInstance: function getAuth0LockInstance(options) {
      var clientID = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var domain = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      clientID = clientID || _get(this, 'clientID');
      domain = domain || _get(this, 'domain');
      var Auth0LockConstructor = _get(this, '_auth0Lock');

      return new Auth0LockConstructor(clientID, domain, options);
    },

    getAuth0Instance: function getAuth0Instance() {
      var clientID = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var domain = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      clientID = clientID || _get(this, 'clientID');
      domain = domain || _get(this, 'domain');

      var Auth0Constructor = _get(this, '_auth0');

      if (_get(this, 'isGreaterThanVersion8')) {
        Auth0Constructor = _auth0['default'].WebAuth;
      }

      return new Auth0Constructor({
        domain: domain,
        clientID: clientID
      });
    },

    getAuth0LockPasswordlessInstance: function getAuth0LockPasswordlessInstance() {
      var clientID = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var domain = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      clientID = clientID || _get(this, 'clientID');
      domain = domain || _get(this, 'domain');
      var Auth0LockPasswordlessConstructor = _get(this, '_auth0LockPasswordless');

      return new Auth0LockPasswordlessConstructor(clientID, domain);
    },

    navigateToLogoutURL: function navigateToLogoutURL() {
      var _getProperties = getProperties(this, 'domain', 'logoutReturnToURL', 'clientID');

      var domain = _getProperties.domain;
      var logoutReturnToURL = _getProperties.logoutReturnToURL;
      var clientID = _getProperties.clientID;

      if (!testing) {
        window.location.replace('https://' + domain + '/v2/logout?returnTo=' + logoutReturnToURL + '&client_id=' + clientID);
      }
    },

    logout: function logout() {
      _get(this, 'session').invalidate().then(this.navigateToLogoutURL.bind(this));
    },

    _auth0: computed(function () {
      return _auth0['default'];
    }),

    _auth0Lock: computed(function () {
      return _auth0Lock['default'];
    }),

    _auth0LockPasswordless: computed(function () {
      return _auth0LockPasswordless['default'];
    }),

    _environmentConfig: computed({
      get: function get() {
        return getOwner(this).resolveRegistration('config:environment');
      }
    })
  });
});