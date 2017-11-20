define('code-corps-ember/initializers/ember-stripe-service', ['exports', 'ember-stripe-service/utils/stripe-mock', 'code-corps-ember/config/environment'], function (exports, _stripeMock, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    var stripeConfig = _environment.default.stripe || {};

    stripeConfig.debug = stripeConfig.debug || _environment.default.LOG_STRIPE_SERVICE;

    application.register('config:stripe', stripeConfig, { instantiate: false });
    application.inject('service:stripe', 'config', 'config:stripe');

    if (stripeConfig.debug) {
      Ember.Logger.info('StripeService: initialize');
    }

    if (!stripeConfig.publishableKey) {
      throw new Ember.Error("StripeService: Missing Stripe key, please set `ENV.stripe.publishableKey` in config.environment.js");
    }

    if (typeof FastBoot !== 'undefined' || stripeConfig.mock) {
      window.Stripe = _stripeMock.default;
    }
  }

  exports.default = {
    name: 'ember-stripe-stripe',
    initialize: initialize
  };
});