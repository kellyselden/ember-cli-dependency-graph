define('code-corps-ember/initializers/ember-stripe-elements', ['exports', 'code-corps-ember/config/environment', 'ember-stripe-elements/utils/stripe-mock'], function (exports, _environment, _stripeMock) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var EmberError = Ember.Error;
  function initialize() {
    var application = arguments[1] || arguments[0];
    var stripeConfig = _environment.default.stripe || {};

    application.register('config:stripe', stripeConfig, { instantiate: false });
    application.inject('service:stripev3', 'config', 'config:stripe');

    if (!stripeConfig.publishableKey) {
      throw new Ember.Error("stripev3: Missing Stripe key, please set `ENV.stripe.publishableKey` in config.environment.js");
    }

    if (typeof FastBoot !== 'undefined' || stripeConfig.mock) {
      window.Stripe = _stripeMock.default;
    }
  }

  exports.default = {
    name: 'ember-stripe-elements',
    initialize: initialize
  };
});