define('code-corps-ember/components/payments/funds-recipient', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNameBindings: ['highlightClass'],
    classNames: ['funds-recipient', 'panel', 'panel--separated'],

    status: alias('stripeConnectAccount.recipientStatus'),

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