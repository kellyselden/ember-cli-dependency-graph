define('torii/providers/facebook-connect', ['exports', 'torii/providers/base', 'torii/configuration'], function (exports, _base, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* global FB, $ */

  /**
   * This class implements OAuth authorization for Facebook
   * connect using the Facebook Connect SDK.
   * It eagerly loads the Facebook Connect script using the settings provided
   * unless it detects the presence of the global `window.FB`.
   */

  var on = Ember.on;
  var fbPromise;

  function fbLoad(settings) {
    if (fbPromise) {
      return fbPromise;
    }

    var original = window.fbAsyncInit;
    var locale = settings.locale;
    delete settings.locale;
    fbPromise = new Ember.RSVP.Promise(function (resolve) {
      if (window.FB) {
        return resolve();
      }
      window.fbAsyncInit = function () {
        FB.init(settings);
        Ember.run(null, resolve);
      };
      $.getScript('//connect.facebook.net/' + locale + '/sdk.js');
    }).then(function () {
      window.fbAsyncInit = original;
      if (window.fbAsyncInit) {
        window.fbAsyncInit.hasRun = true;
        window.fbAsyncInit();
      }
    });

    return fbPromise;
  }

  function fbLogin(scope, returnScopes, authType) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      FB.login(function (response) {
        if (response.authResponse) {
          Ember.run(null, resolve, response.authResponse);
        } else {
          Ember.run(null, reject, response.status);
        }
      }, { scope: scope, return_scopes: returnScopes, auth_type: authType });
    });
  }

  function fbNormalize(response) {
    var normalized = {
      userId: response.userID,
      accessToken: response.accessToken,
      expiresIn: response.expiresIn
    };
    if (response.grantedScopes) {
      normalized.grantedScopes = response.grantedScopes;
    }
    return normalized;
  }

  var Facebook = _base.default.extend({

    // Facebook connect SDK settings:
    name: 'facebook-connect',
    scope: (0, _configuration.configurable)('scope', 'email'),
    returnScopes: (0, _configuration.configurable)('returnScopes', false),
    appId: (0, _configuration.configurable)('appId'),
    version: (0, _configuration.configurable)('version', 'v2.2'),
    xfbml: (0, _configuration.configurable)('xfbml', false),
    channelUrl: (0, _configuration.configurable)('channelUrl', null),
    locale: (0, _configuration.configurable)('locale', 'en_US'),

    // API:
    //
    open: function open(options) {
      if (options === undefined) options = {};
      var scope = this.get('scope');
      var authType = options.authType;
      var returnScopes = this.get('returnScopes');

      return fbLoad(this.settings()).then(function () {
        return fbLogin(scope, returnScopes, authType);
      }).then(fbNormalize);
    },

    settings: function settings() {
      return {
        status: true,
        cookie: true,
        xfbml: this.get('xfbml'),
        version: this.get('version'),
        appId: this.get('appId'),
        channelUrl: this.get('channelUrl'),
        locale: this.get('locale')
      };
    },

    // Load Facebook's script eagerly, so that the window.open
    // in FB.login will be part of the same JS frame as the
    // click itself.
    loadFbLogin: on('init', function () {
      fbLoad(this.settings());
    })

  });

  exports.default = Facebook;
});