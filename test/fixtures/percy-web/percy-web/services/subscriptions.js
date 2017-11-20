define('percy-web/services/subscriptions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    store: service(),
    changeSubscription: function changeSubscription(organization, plan, token) {
      // Always create a new POST request to change subscription, don't modify the subscription
      // object directly unless just changing attributes.
      var subscription = this.get('store').createRecord('subscription', {
        organization: organization,
        billingEmail: organization.get('subscription.billingEmail'),
        plan: plan,
        token: token && token.id
      });
      var savingPromise = subscription.save();

      savingPromise.then(function () {}, function () {
        alert('A Stripe error occurred! Your card may have been declined. Please try again or ' + 'contact us at hello@percy.io and we will help you get set up.');
        location.reload();
      });
      return savingPromise;
    }
  });
});