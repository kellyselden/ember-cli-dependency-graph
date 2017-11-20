define('torii/providers/google-oauth2-bearer', ['exports', 'torii/providers/oauth2-bearer', 'torii/configuration'], function (exports, _oauth2Bearer, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * This class implements authentication against google
   * using the client-side OAuth2 authorization flow in a popup window.
   */

  var GoogleOauth2Bearer = _oauth2Bearer.default.extend({

    name: 'google-oauth2-bearer',
    baseUrl: 'https://accounts.google.com/o/oauth2/auth',

    // additional params that this provider requires
    optionalUrlParams: ['scope', 'request_visible_actions', 'hd'],

    requestVisibleActions: (0, _configuration.configurable)('requestVisibleActions', ''),

    responseParams: ['access_token'],

    scope: (0, _configuration.configurable)('scope', 'email'),

    redirectUri: (0, _configuration.configurable)('redirectUri', 'http://localhost:4200/oauth2callback'),
    hd: (0, _configuration.configurable)('hd', '')
  });

  exports.default = GoogleOauth2Bearer;
});