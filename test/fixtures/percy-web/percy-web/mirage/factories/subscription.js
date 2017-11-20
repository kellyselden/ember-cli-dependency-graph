define('percy-web/mirage/factories/subscription', ['exports', 'moment', 'ember-cli-mirage'], function (exports, _moment, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    billingEmail: function billingEmail(i) {
      return 'billing-email-' + i + '@example.com';
    },
    currentPeriodStart: function currentPeriodStart() {
      return (0, _moment.default)('2020-01-15');
    },
    currentPeriodEnd: function currentPeriodEnd() {
      return (0, _moment.default)('2020-02-15');
    },
    afterCreate: function afterCreate(subscription, server) {
      if (!subscription.plan) {
        var plan = server.create('plan');
        subscription.update({ plan: plan });
      }
    }
  });
});