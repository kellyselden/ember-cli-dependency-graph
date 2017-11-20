define('torii/providers/edmodo-connect', ['exports', 'torii/providers/oauth2-bearer', 'torii/configuration'], function (exports, _oauth2Bearer, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth2Bearer.default.extend({
    name: 'edmodo-connect',
    baseUrl: 'https://api.edmodo.com/oauth/authorize',
    responseParams: ['access_token'],

    /* Configurable parameters */
    redirectUri: (0, _configuration.configurable)('redirectUri'),
    // See https://developers.edmodo.com/edmodo-connect/docs/#connecting-your-application for the full list of scopes
    scope: (0, _configuration.configurable)('scope', 'basic')
  });
});