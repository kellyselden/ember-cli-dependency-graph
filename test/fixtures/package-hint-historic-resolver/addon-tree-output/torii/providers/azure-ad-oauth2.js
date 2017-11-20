define('torii/providers/azure-ad-oauth2', ['exports', 'torii/providers/oauth2-code', 'torii/configuration'], function (exports, _oauth2Code, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var computed = Ember.computed;

  /**
   * This class implements authentication against AzureAD
   * using the OAuth2 authorization flow in a popup window.
   * @class
   */
  var AzureAdOauth2 = _oauth2Code.default.extend({
    name: 'azure-ad-oauth2',

    baseUrl: computed(function () {
      return 'https://login.windows.net/' + this.get('tennantId') + '/oauth2/authorize';
    }),

    tennantId: (0, _configuration.configurable)('tennantId', 'common'),

    // additional url params that this provider requires
    requiredUrlParams: ['api-version', 'client_id'],

    optionalUrlParams: ['scope', 'nonce', 'response_mode'],

    responseMode: (0, _configuration.configurable)('responseMode', null),

    responseParams: computed(function () {
      return [this.get('responseType'), 'state'];
    }),

    apiVersion: '1.0',

    responseType: (0, _configuration.configurable)('responseType', 'code'),

    redirectUri: (0, _configuration.configurable)('redirectUri', function azureRedirectUri() {
      // A hack that allows redirectUri to be configurable
      // but default to the superclass
      return this._super();
    })
  });

  exports.default = AzureAdOauth2;
});