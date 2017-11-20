define('ember-stripe-elements/components/stripe-card-cvc', ['exports', 'ember-stripe-elements/components/stripe-element', 'ember-stripe-elements/templates/components/stripe-card-cvc'], function (exports, _stripeElement, _stripeCardCvc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _stripeElement.default.extend({
    layout: _stripeCardCvc.default,

    classNames: ['ember-stripe-card-cvc'],

    type: 'cardCvc'
  });
});