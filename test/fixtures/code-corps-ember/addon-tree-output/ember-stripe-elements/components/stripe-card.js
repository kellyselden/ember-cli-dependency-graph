define('ember-stripe-elements/components/stripe-card', ['exports', 'ember-stripe-elements/components/stripe-element', 'ember-stripe-elements/templates/components/stripe-card'], function (exports, _stripeElement, _stripeCard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _stripeElement.default.extend({
    layout: _stripeCard.default,

    classNames: ['ember-stripe-card'],

    type: 'card'
  });
});