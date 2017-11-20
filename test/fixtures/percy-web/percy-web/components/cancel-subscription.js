define('percy-web/components/cancel-subscription', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    store: service(),

    organization: null,
    classes: null,
    changingSubscription: null,

    subscriptionService: service('subscriptions'),
    tagName: 'button',
    classNames: ['Button'],
    classNameBindings: ['classes'],
    click: function click() {
      var organization = this.get('organization');
      var eventProperties = {
        plan_id: this.get('organization.subscription.plan')
      };
      this.analytics.track('Cancel Subscription Clicked', organization, eventProperties);

      // Get or create the plan record with the right ID.
      var plan = this.get('store').peekRecord('plan', 'free');
      plan = plan || this.get('store').createRecord('plan', { id: 'free' });

      var confirmation = confirm('Are you sure you want to cancel?\n\nWe want to help if we can, just email us at hello@percy.io.');
      if (!confirmation) {
        return;
      }
      var savingPromise = this.get('subscriptionService').changeSubscription(organization, plan);
      if (this.get('changingSubscription')) {
        this.get('changingSubscription')(savingPromise);
      }
    }
  });
});