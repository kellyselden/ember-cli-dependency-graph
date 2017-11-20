define('ember-stripe-elements/components/stripe-postal-code', ['exports', 'ember-stripe-elements/components/stripe-element', 'ember-stripe-elements/templates/components/stripe-postal-code'], function (exports, _stripeElement, _stripePostalCode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _stripeElement.default.extend({
    layout: _stripePostalCode.default,

    classNames: ['ember-stripe-postal-code'],

    type: 'postalCode'
  });
});