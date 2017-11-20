define('ember-simple-auth/session-stores/cookie', ['exports', 'ember', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/utils/objects-are-equal'], function (exports, _ember, _emberSimpleAuthSessionStoresBase, _emberSimpleAuthUtilsObjectsAreEqual) {
  var RSVP = _ember['default'].RSVP;
  var computed = _ember['default'].computed;
  var service = _ember['default'].inject.service;
  var _Ember$run = _ember['default'].run;
  var next = _Ember$run.next;
  var scheduleOnce = _Ember$run.scheduleOnce;
  var cancel = _Ember$run.cancel;
  var later = _Ember$run.later;
  var isEmpty = _ember['default'].isEmpty;
  var typeOf = _ember['default'].typeOf;
  var testing = _ember['default'].testing;
  var isPresent = _ember['default'].isPresent;
  var A = _ember['default'].A;
  var getOwner = _ember['default'].getOwner;

  var persistingProperty = function persistingProperty() {
    var beforeSet = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

    return computed({
      get: function get(key) {
        return this.get('_' + key);
      },
      set: function set(key, value) {
        beforeSet.apply(this, [key, value]);
        this.set('_' + key, value);
        scheduleOnce('actions', this, this.rewriteCookie);
        return value;
      }
    });
  };

  /**
    Session store that persists data in a cookie.
  
    By default the cookie session store uses a session cookie that expires and is
    deleted when the browser is closed. The cookie expiration period can be
    configured by setting the
    {{#crossLink "CookieStore/cookieExpirationTime:property"}}{{/crossLink}}
    property. This can be used to implement "remember me" functionality that will
    either store the session persistently or in a session cookie depending on
    whether the user opted in or not:
  
    ```js
    // app/controllers/login.js
    export default Ember.Controller.extend({
      rememberMe: false,
  
      _rememberMeChanged: Ember.observer('rememberMe', function() {
        const expirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null;
        this.set('session.store.cookieExpirationTime', expirationTime);
      }
    });
    ```
  
    __Applications that use FastBoot must use this session store by defining the
    application session store like this:__
  
    ```js
    // app/session-stores/application.js
    import CookieStore from 'ember-simple-auth/session-stores/cookie';
  
    export default CookieStore.extend();
    ```
  
    @class CookieStore
    @module ember-simple-auth/session-stores/cookie
    @extends BaseStore
    @public
  */
  exports['default'] = _emberSimpleAuthSessionStoresBase['default'].extend({
    _syncDataTimeout: null,
    _renewExpirationTimeout: null,

    /**
      The domain to use for the cookie, e.g., "example.com", ".example.com"
      (which includes all subdomains) or "subdomain.example.com". If not
      explicitly set, the cookie domain defaults to the domain the session was
      authenticated on.
       @property cookieDomain
      @type String
      @default null
      @public
    */
    _cookieDomain: null,
    cookieDomain: persistingProperty(),

    /**
      The name of the cookie.
       @property cookieName
      @type String
      @default ember_simple_auth-session
      @public
    */
    _cookieName: 'ember_simple_auth-session',
    cookieName: persistingProperty(function () {
      this._oldCookieName = this._cookieName;
    }),

    /**
      The expiration time for the cookie in seconds. A value of `null` will make
      the cookie a session cookie that expires and gets deleted when the browser
      is closed.
       The recommended minimum value is 90 seconds. If your value is less than
      that, the cookie may expire before its expiration time is extended
      (expiration time is extended every 60 seconds).
       @property cookieExpirationTime
      @default null
      @type Integer
      @public
    */
    _cookieExpirationTime: null,
    cookieExpirationTime: persistingProperty(function (key, value) {
      if (value < 90) {
        // jscs:disable disallowDirectPropertyAccess
        _ember['default'].warn('The recommended minimum value for `cookieExpirationTime` is 90 seconds. If your value is less than that, the cookie may expire before its expiration time is extended (expiration time is extended every 60 seconds).', false, { id: 'ember-simple-auth.cookieExpirationTime' });
        // jscs:enable disallowDirectPropertyAccess
      }
    }),

    _cookies: service('cookies'),

    _fastboot: computed(function () {
      var owner = getOwner(this);

      return owner && owner.lookup('service:fastboot');
    }),

    _secureCookies: computed(function () {
      if (this.get('_fastboot.isFastBoot')) {
        return this.get('_fastboot.request.protocol') === 'https';
      }

      return window.location.protocol === 'https:';
    }).volatile(),

    _isPageVisible: computed(function () {
      if (this.get('_fastboot.isFastBoot')) {
        return false;
      } else {
        var visibilityState = typeof document !== 'undefined' ? document.visibilityState || 'visible' : false;
        return visibilityState === 'visible';
      }
    }).volatile(),

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      if (!this.get('_fastboot.isFastBoot')) {
        next(function () {
          _this._syncData().then(function () {
            _this._renewExpiration();
          });
        });
      } else {
        this._renew();
      }
    },

    /**
      Persists the `data` in the cookie.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._lastData = data;
      data = JSON.stringify(data || {});
      var expiration = this._calculateExpirationTime();
      this._write(data, expiration);
      return RSVP.resolve();
    },

    /**
      Returns all data currently stored in the cookie as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = this._read(this.get('cookieName'));
      if (isEmpty(data)) {
        return RSVP.resolve({});
      } else {
        return RSVP.resolve(JSON.parse(data));
      }
    },

    /**
      Clears the store by deleting the cookie.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      this._write('', 0);
      this._lastData = {};
      return RSVP.resolve();
    },

    _read: function _read(name) {
      return this.get('_cookies').read(name) || '';
    },

    _calculateExpirationTime: function _calculateExpirationTime() {
      var cachedExpirationTime = this._read(this.get('cookieName') + '-expiration_time');
      cachedExpirationTime = cachedExpirationTime ? new Date().getTime() + cachedExpirationTime * 1000 : null;
      return this.get('cookieExpirationTime') ? new Date().getTime() + this.get('cookieExpirationTime') * 1000 : cachedExpirationTime;
    },

    _write: function _write(value, expiration) {
      var _this2 = this;

      var cookieOptions = {
        domain: this.get('cookieDomain'),
        expires: isEmpty(expiration) ? null : new Date(expiration),
        path: '/',
        secure: this.get('_secureCookies')
      };
      if (this._oldCookieName) {
        A([this._oldCookieName, this._oldCookieName + '-expiration_time']).forEach(function (oldCookie) {
          _this2.get('_cookies').clear(oldCookie);
        });
        delete this._oldCookieName;
      }
      this.get('_cookies').write(this.get('cookieName'), value, cookieOptions);
      if (!isEmpty(expiration)) {
        var expirationCookieName = this.get('cookieName') + '-expiration_time';
        var cachedExpirationTime = this.get('_cookies').read(expirationCookieName);
        this.get('_cookies').write(expirationCookieName, this.get('cookieExpirationTime') || cachedExpirationTime, cookieOptions);
      }
    },

    _syncData: function _syncData() {
      var _this3 = this;

      return this.restore().then(function (data) {
        if (!(0, _emberSimpleAuthUtilsObjectsAreEqual['default'])(data, _this3._lastData)) {
          _this3._lastData = data;
          _this3.trigger('sessionDataUpdated', data);
        }
        if (!testing) {
          cancel(_this3._syncDataTimeout);
          _this3._syncDataTimeout = later(_this3, _this3._syncData, 500);
        }
      });
    },

    _renew: function _renew() {
      var _this4 = this;

      return this.restore().then(function (data) {
        if (!isEmpty(data) && data !== {}) {
          data = typeOf(data) === 'string' ? data : JSON.stringify(data || {});
          var expiration = _this4._calculateExpirationTime();
          _this4._write(data, expiration);
        }
      });
    },

    _renewExpiration: function _renewExpiration() {
      if (!testing) {
        cancel(this._renewExpirationTimeout);
        this._renewExpirationTimeout = later(this, this._renewExpiration, 60000);
      }
      if (this.get('_isPageVisible')) {
        return this._renew();
      } else {
        return RSVP.resolve();
      }
    },

    rewriteCookie: function rewriteCookie() {
      var data = this._read(this._oldCookieName);
      if (isPresent(data)) {
        var expiration = this._calculateExpirationTime();
        this._write(data, expiration);
      }
    }
  });
});