define('torii/providers/stripe-connect', ['exports', 'torii/providers/oauth2-code', 'torii/configuration'], function (exports, _oauth2Code, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth2Code.default.extend({
    name: 'stripe-connect',
    baseUrl: 'https://connect.stripe.com/oauth/authorize',

    // additional url params that this provider requires
    requiredUrlParams: [],
    optionalUrlParams: ['stripe_landing', 'always_prompt'],

    responseParams: ['code', 'state'],

    scope: (0, _configuration.configurable)('scope', 'read_write'),
    stripeLanding: (0, _configuration.configurable)('stripeLanding', ''),
    alwaysPrompt: (0, _configuration.configurable)('alwaysPrompt', 'false'),

    redirectUri: (0, _configuration.configurable)('redirectUri', function () {
      // A hack that allows redirectUri to be configurable
      // but default to the superclass
      return this._super();
    })
  });
});