define('ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service,
      Mixin = Ember.Mixin,
      computed = Ember.computed,
      getOwner = Ember.getOwner;
  exports.default = Mixin.create({
    /**
     The session service.
      @property session
     @readOnly
     @type SessionService
     @public
     */
    session: service('session'),

    /**
      The authenticator that should be used to authenticate the callback. This
      must be a subclass of the
      {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}
      authenticator.
       @property authenticator
      @type String
      @default null
      @public
    */
    authenticator: null,

    /**
      Any error that potentially occurs during authentication will be stored in
      this property.
       @property error
      @type String
      @default null
      @public
    */
    error: null,

    /**
      Passes the hash received with the redirection from the authentication
      server to the
      {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}} and
      authenticates the session with the authenticator.
       @method activate
      @public
    */
    activate: function activate() {
      var _this = this;

      if (this.get('_isFastBoot')) {
        return;
      }

      var authenticator = this.get('authenticator');

      var hash = this._parseResponse(this._windowLocationHash());

      this.get('session').authenticate(authenticator, hash).catch(function (err) {
        _this.set('error', err);
      });
    },


    _isFastBoot: computed(function () {
      var fastboot = getOwner(this).lookup('service:fastboot');

      return fastboot ? fastboot.get('isFastBoot') : false;
    }),

    _windowLocationHash: function _windowLocationHash() {
      // we wrap this so we can stub it with sinon
      return window.location.hash;
    },
    _parseResponse: function _parseResponse(locationHash) {
      var params = {};
      var query = locationHash.substring(locationHash.indexOf('?'));
      var regex = /([^#?&=]+)=([^&]*)/g;
      var match = void 0;

      // decode all parameter pairs
      while ((match = regex.exec(query)) !== null) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }

      return params;
    }
  });
});