define('ember-stripe-elements/components/stripe-card-expiry', ['exports', 'ember-stripe-elements/components/stripe-element', 'ember-stripe-elements/templates/components/stripe-card-expiry'], function (exports, _stripeElement, _stripeCardExpiry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _stripeElement.default.extend({
    layout: _stripeCardExpiry.default,

    classNames: ['ember-stripe-card-expiry'],

    type: 'cardExpiry'
  });
});