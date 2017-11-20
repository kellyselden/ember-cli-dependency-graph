define('code-corps-ember/components/payments/funds-recipient/personal-id-number', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['personal-id-number'],
    tagName: 'section',

    status: alias('stripeConnectAccount.personalIdNumberStatus')
  });
});