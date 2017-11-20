define('code-corps-ember/components/payments/bank-account', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNameBindings: ['highlightClass'],
    classNames: ['bank-account', 'panel', 'panel--separated'],

    accountNumber: null,
    routingNumber: null,

    status: alias('stripeConnectAccount.bankAccountStatus'),

    highlightClass: computed('status', function () {
      var status = get(this, 'status');

      if (status == 'verified') {
        return 'panel--highlighted-green';
      } else if (status == 'required') {
        return 'panel--highlighted';
      } else {
        return '';
      }
    })
  });
});