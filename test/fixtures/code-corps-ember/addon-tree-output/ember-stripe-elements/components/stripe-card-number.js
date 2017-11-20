define('ember-stripe-elements/components/stripe-card-number', ['exports', 'ember-stripe-elements/components/stripe-element', 'ember-stripe-elements/templates/components/stripe-card-number'], function (exports, _stripeElement, _stripeCardNumber) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _stripeElement.default.extend({
    layout: _stripeCardNumber.default,

    classNames: ['ember-stripe-card-number'],

    type: 'cardNumber'
  });
});