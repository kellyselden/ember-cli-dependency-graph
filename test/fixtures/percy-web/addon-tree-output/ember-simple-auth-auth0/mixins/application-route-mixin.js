define('ember-simple-auth-auth0/mixins/application-route-mixin', ['exports', 'ember', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _ember, _emberSimpleAuthMixinsApplicationRouteMixin) {
  var Mixin = _ember['default'].Mixin;
  var computed = _ember['default'].computed;
  var _get = _ember['default'].get;
  var getWithDefault = _ember['default'].getWithDefault;
  var set = _ember['default'].set;
  var RSVP = _ember['default'].RSVP;
  var resolve = _ember['default'].RSVP.resolve;
  var service = _ember['default'].inject.service;
  var run = _ember['default'].run;
  var testing = _ember['default'].testing;
  var isEmpty = _ember['default'].isEmpty;
  exports['default'] = Mixin.create(_emberSimpleAuthMixinsApplicationRouteMixin['default'], {
    session: service(),
    auth0: service(),

    sessionAuthenticated: function sessionAuthenticated() {
      this._setupFutureEvents();
      this._super.apply(this, arguments);
    },

    /**
     * Hook that gets called after the jwt has expired
     * but before we notify the rest of the system.
     * Great place to add cleanup to expire any third-party
     * tokens or other cleanup.
     *
     * IMPORTANT: You must return a promise, else logout
     * will not continue.
     *
     * @return {Promise}
     */
    beforeSessionExpired: function beforeSessionExpired() {
      return resolve();
    },

    /**
     * This has to be overridden because the default behavior prevents
     * auth0 to logout correctly.
     */
    sessionInvalidated: function sessionInvalidated() {
      this._clearJobs();
      return this._super.apply(this, arguments);
    },

    beforeModel: function beforeModel() {
      this._setupFutureEvents();
      var promise = resolve(this._super.apply(this, arguments));

      promise = promise.then(this._getUrlHashData.bind(this)).then(this._authenticateWithUrlHash.bind(this));

      return promise;
    },

    willDestroy: function willDestroy() {
      this._clearJobs();
    },

    _authenticateWithUrlHash: function _authenticateWithUrlHash(urlHashData) {
      if (isEmpty(urlHashData)) {
        return;
      }

      return _get(this, 'session').authenticate('authenticator:auth0-url-hash', urlHashData);
    },

    _getUrlHashData: function _getUrlHashData() {
      if (_get(this, 'auth0.isGreaterThanVersion8')) {
        return this._getNewUrlHashData();
      }

      return this._getDeprecatedUrlHashData();
    },

    _getNewUrlHashData: function _getNewUrlHashData() {
      var auth0 = _get(this, 'auth0').getAuth0Instance();
      return new RSVP.Promise(function (resolve, reject) {
        // TODO: Check to see if we cannot parse the hash or check to see which version of auth0 we are using.... ugh
        auth0.parseHash(function (err, parsedPayload) {
          if (err) {
            if (err.errorDescription) {
              err.errorDescription = decodeURI(err.errorDescription);
            }

            return reject(err);
          }

          resolve(parsedPayload);
        });
      });
    },

    _getDeprecatedUrlHashData: function _getDeprecatedUrlHashData() {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {

        var auth0 = _get(_this, 'auth0').getAuth0Instance();
        var parsedPayload = auth0.parseHash();

        if (parsedPayload && parsedPayload.error && parsedPayload.error_description) {
          parsedPayload.errorDescription = decodeURI(parsedPayload.error_description);
          delete parsedPayload.error_description;
          return reject(parsedPayload);
        }

        return resolve(parsedPayload);
      });
    },
    _setupFutureEvents: function _setupFutureEvents() {
      // Don't schedule expired events during testing, otherwise acceptance tests will hang.
      if (testing) {
        return;
      }

      this._scheduleExpire();
    },

    _scheduleExpire: function _scheduleExpire() {
      run.cancel(_get(this, '_expireJob'));
      var expireInMilli = _get(this, '_jwtRemainingTimeInSeconds') * 1000;
      var job = run.later(this, this._processSessionExpired, expireInMilli);
      set(this, '_expireJob', job);
    },

    /**
     * The current JWT's expire time
     * @return {Number in seconds}
     */
    _expiresAt: computed('session.data.authenticated', {
      get: function get() {
        var exp = 0;

        if (!_get(this, 'session.isAuthenticated')) {
          return exp;
        }

        var foo = getWithDefault(this, 'session.data.authenticated.idTokenPayload.exp', exp);

        return getWithDefault(this, 'session.data.authenticated.expiresIn', foo);
      }
    }),

    _jwtRemainingTimeInSeconds: computed('_expiresAt', {
      get: function get() {
        return getWithDefault(this, '_expiresAt', 0);
      }
    }),

    _clearJobs: function _clearJobs() {
      run.cancel(_get(this, '_expireJob'));
    },

    _processSessionExpired: function _processSessionExpired() {
      return this.beforeSessionExpired().then(this._invalidateIfAuthenticated.bind(this));
    },

    _invalidateIfAuthenticated: function _invalidateIfAuthenticated() {
      var session = _get(this, 'session');

      if (_get(session, 'isAuthenticated')) {
        session.invalidate();
      }
    }
  });
});