define('ember-simple-auth/session-stores/adaptive', ['exports', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/session-stores/local-storage', 'ember-simple-auth/session-stores/cookie'], function (exports, _base, _localStorage, _cookie) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      service = Ember.inject.service,
      getOwner = Ember.getOwner;


  var LOCAL_STORAGE_TEST_KEY = '_ember_simple_auth_test_key';

  var proxyToInternalStore = function proxyToInternalStore() {
    return computed({
      get: function get(key) {
        return this.get('_' + key);
      },
      set: function set(key, value) {
        this.set('_' + key, value);
        var _store = this.get('_store');
        if (_store) {
          _store.set(key, value);
        }
        return value;
      }
    });
  };

  /**
    Session store that persists data in the browser's `localStorage` (see
    {{#crossLink "LocalStorageStore"}}{{/crossLink}}) if that is available or in
    a cookie (see {{#crossLink "CookieStore"}}{{/crossLink}}) if it is not.
  
    __This is the default store that Ember Simple Auth will use when the
    application doesn't define a custom store.__
  
    __This session store does not work with FastBoot. In order to use Ember
    Simple Auth with FastBoot, configure the
    {{#crossLink "CookieStore"}}{{/crossLink}} as the application's session
    store.__
  
    @class AdaptiveStore
    @module ember-simple-auth/session-stores/adaptive
    @extends BaseStore
    @public
  */
  exports.default = _base.default.extend({
    /**
      The `localStorage` key the store persists data in if `localStorage` is
      available.
       @property localStorageKey
      @type String
      @default 'ember_simple_auth-session'
      @public
    */
    localStorageKey: 'ember_simple_auth-session',

    /**
      The domain to use for the cookie if `localStorage` is not available, e.g.,
      "example.com", ".example.com" (which includes all subdomains) or
      "subdomain.example.com". If not explicitly set, the cookie domain defaults
      to the domain the session was authenticated on.
       @property cookieDomain
      @type String
      @default null
      @public
    */
    _cookieDomain: null,
    cookieDomain: proxyToInternalStore(),

    /**
      The name of the cookie to use if `localStorage` is not available.
       @property cookieName
      @type String
      @default ember_simple_auth-session
      @public
    */
    _cookieName: 'ember_simple_auth-session',
    cookieName: proxyToInternalStore(),

    /**
      The path to use for the cookie, e.g., "/", "/something".
       @property cookiePath
      @type String
      @default '/'
      @public
    */
    _cookiePath: '/',
    cookiePath: proxyToInternalStore(),

    /**
      The expiration time for the cookie in seconds if `localStorage` is not
      available. A value of `null` will make the cookie a session cookie that
      expires and gets deleted when the browser is closed.
       @property cookieExpirationTime
      @default null
      @type Integer
      @public
    */
    _cookieExpirationTime: null,
    cookieExpirationTime: proxyToInternalStore(),

    _cookies: service('cookies'),

    _fastboot: computed(function () {
      var owner = getOwner(this);

      return owner && owner.lookup('service:fastboot');
    }),

    _isLocalStorageAvailable: computed(function () {
      try {
        localStorage.setItem(LOCAL_STORAGE_TEST_KEY, true);
        localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
        return true;
      } catch (e) {
        return false;
      }
    }),

    init: function init() {
      this._super.apply(this, arguments);

      var store = void 0;
      if (this.get('_isLocalStorageAvailable')) {
        var options = { key: this.get('localStorageKey') };
        options._isFastBoot = false;
        store = this._createStore(_localStorage.default, options);
      } else {
        var _options = this.getProperties('cookieDomain', 'cookieName', 'cookieExpirationTime', 'cookiePath');
        _options._fastboot = this.get('_fastboot');
        _options._cookies = this.get('_cookies');

        store = this._createStore(_cookie.default, _options);
        this.set('cookieExpirationTime', store.get('cookieExpirationTime'));
      }
      this.set('_store', store);
    },
    _createStore: function _createStore(storeType, options) {
      var _this = this;

      var store = storeType.create(options);

      store.on('sessionDataUpdated', function (data) {
        _this.trigger('sessionDataUpdated', data);
      });
      return store;
    },


    /**
      Persists the `data` in the `localStorage` if it is available or in a cookie
      if it is not.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist() {
      var _get;

      return (_get = this.get('_store')).persist.apply(_get, arguments);
    },


    /**
      Returns all data currently stored in the `localStorage` if that is
      available - or if it is not, in the cookie - as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      return this.get('_store').restore();
    },


    /**
      Clears the store by deleting the
      {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
      `localStorage` if that is available or by deleting the cookie if it is not.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      return this.get('_store').clear();
    }
  });
});