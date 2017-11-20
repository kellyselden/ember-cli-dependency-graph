define('torii/providers/linked-in-oauth2', ['exports', 'torii/providers/oauth2-code', 'torii/configuration'], function (exports, _oauth2Code, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This class implements authentication against Linked In
   * using the OAuth2 authorization flow in a popup window.
   *
   * @class LinkedInOauth2
   */
  var LinkedInOauth2 = _oauth2Code.default.extend({
    name: 'linked-in-oauth2',
    baseUrl: 'https://www.linkedin.com/uas/oauth2/authorization',

    responseParams: ['code', 'state'],

    redirectUri: (0, _configuration.configurable)('redirectUri', function () {
      // A hack that allows redirectUri to be configurable
      // but default to the superclass
      return this._super();
    })

  });

  exports.default = LinkedInOauth2;
});