define('torii/providers/facebook-oauth2', ['exports', 'torii/configuration', 'torii/providers/oauth2-code'], function (exports, _configuration, _oauth2Code) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth2Code.default.extend({
    name: 'facebook-oauth2',
    baseUrl: 'https://www.facebook.com/dialog/oauth',

    // Additional url params that this provider requires
    requiredUrlParams: ['display'],

    responseParams: ['code', 'state'],

    scope: (0, _configuration.configurable)('scope', 'email'),

    display: 'popup',
    redirectUri: (0, _configuration.configurable)('redirectUri', function () {
      // A hack that allows redirectUri to be configurable
      // but default to the superclass
      return this._super();
    }),

    open: function open() {
      return this._super().then(function (authData) {
        if (authData.authorizationCode && authData.authorizationCode === '200') {
          // indication that the user hit 'cancel', not 'ok'
          throw new Error('User canceled authorization');
        }

        return authData;
      });
    }
  });
});