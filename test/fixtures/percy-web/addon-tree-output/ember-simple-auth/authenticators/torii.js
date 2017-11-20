define('ember-simple-auth/authenticators/torii', ['exports', 'ember', 'ember-simple-auth/authenticators/base'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase) {
  var RSVP = _ember['default'].RSVP;
  var isEmpty = _ember['default'].isEmpty;
  var assert = _ember['default'].assert;
  var isPresent = _ember['default'].isPresent;

  /**
    Authenticator that wraps the
    [Torii library](https://github.com/Vestorly/torii) and thus allows to connect
    any external authentication provider that torii defines a provider for.
  
    In order to use this authenticator, __the application needs to have the
    [torii addon](https://github.com/Vestorly/torii) installed and must inject
    the torii service into the authenticator__:
  
    ```js
    // app/authenticators/torii.js
    import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
  
    export default ToriiAuthenticator.extend({
      torii: Ember.inject.service()
    });
    ```
  
    @class ToriiAuthenticator
    @module ember-simple-auth/authenticators/torii
    @extends BaseAuthenticator
    @public
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    _provider: null,

    /**
      Restores the session by calling the torii provider's `fetch` method.
       __Many torii providers do not implement the `fetch` method__. If the
      provider in use does not implement the method simply add it as follows:
       ```js
      // app/torii-providers/facebook.js
      import FacebookOauth2Provider from 'torii/providers/facebook-oauth2';
       export default FacebookOauth2Provider.extend({
        fetch(data) {
          return data;
        }
      });
      ```
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      var _this = this;

      this._assertToriiIsPresent();

      data = data || {};
      if (!isEmpty(data.provider)) {
        var _ret = (function () {
          var _data = data;
          var provider = _data.provider;

          return {
            v: _this.get('torii').fetch(data.provider, data).then(function (data) {
              _this._authenticateWithProvider(provider, data);
              return data;
            }, function () {
              return delete _this._provider;
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        delete this._provider;
        return RSVP.reject();
      }
    },

    /**
      Authenticates the session by opening the specified torii provider. For more
      documentation on torii and its providers abstraction, see the
      [project's README](https://github.com/Vestorly/torii#readme), specifically
      the
      [section on providers](https://github.com/Vestorly/torii#configuring-a-torii-provider).
       @method authenticate
      @param {String} provider The torii provider to authenticate the session with
      @param {Object} options The options to pass to the torii provider
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate(provider, options) {
      var _this2 = this;

      this._assertToriiIsPresent();

      return this.get('torii').open(provider, options || {}).then(function (data) {
        _this2._authenticateWithProvider(provider, data);
        return data;
      });
    },

    /**
      Closes the torii provider. If the provider is successfully closed, this
      method returns a resolving promise, otherwise it will return a rejecting
      promise, thus intercepting session invalidation.
       @method invalidate
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      @public
    */
    invalidate: function invalidate(data) {
      var _this3 = this;

      return this.get('torii').close(this._provider, data).then(function () {
        delete _this3._provider;
      });
    },

    _authenticateWithProvider: function _authenticateWithProvider(provider, data) {
      data.provider = provider;
      this._provider = data.provider;
    },

    _assertToriiIsPresent: function _assertToriiIsPresent() {
      var torii = this.get('torii');
      assert('You are trying to use the torii authenticator but torii is not available. Inject torii into the authenticator with "torii: Ember.inject.service()".', isPresent(torii));
    }
  });
});