define('percy-web/components/stripe-checkout', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    planId: null,
    planName: null,
    price: null,
    text: 'Select Plan',

    changingSubscription: null,

    // This is set to true when updating credit card info.
    updateCard: false,
    checkoutLabelText: 'Select Plan ({{amount}})',

    store: service(),
    subscriptionService: service('subscriptions'),
    handler: null,
    classes: null,
    attributeBindings: ['href'],
    tagName: 'button',
    classNames: ['StripeCheckout', 'Button'],
    classNameBindings: ['classes'],

    loadStripeCheckout: on('willInsertElement', function () {
      if (!window.StripeCheckout) {
        var scriptEl = document.createElement('script');
        scriptEl.setAttribute('src', 'https://checkout.stripe.com/checkout.js');
        // https://stripe.com/blog/checkout-in-more-languages
        scriptEl.setAttribute('data-locale', 'auto');
        scriptEl.setAttribute('data-allow-remember-me', 'false');
        document.head.appendChild(scriptEl);
      }
    }),
    destroyStripeHandler: on('willDestroyElement', function () {
      if (this.get('handler')) {
        this.get('handler').close();
      }
    }),
    _changeSubscription: function _changeSubscription(planId, token) {
      var organization = this.get('organization');
      var subscriptionService = this.get('subscriptionService');

      // Get or create the plan record with the right ID.
      var plan = this.get('store').peekRecord('plan', planId);
      plan = plan || this.get('store').createRecord('plan', { id: planId });

      var savingPromise = subscriptionService.changeSubscription(organization, plan, token);
      if (this.get('changingSubscription')) {
        this.get('changingSubscription')(savingPromise);
      }
    },
    click: function click() {
      this.send('checkout');
      return false;
    },

    actions: {
      checkout: function checkout() {
        var self = this;

        // This is intentionally evaluated here, outside of the handlers below, because password
        // managers like 1Password might strangely change the inputs underneath Stripe Checkout
        // when filling out credit card info.
        var chosenPlanId = this.get('planId');
        var planName = this.get('planName');

        if (!this.get('updateCard')) {
          var organization = this.get('organization');
          var eventProperties = {
            plan_id: chosenPlanId,
            current_plan_id: this.get('organization.subscription.plan.id')
          };
          this.analytics.track('Billing Plan Selected', organization, eventProperties);
        }

        if (this.get('updateCard') || this.get('organization.subscription.isTrialOrFree')) {
          this.set('handler', window.StripeCheckout.configure({
            key: _environment.default.APP.STRIPE_PUBLISHABLE_KEY,
            image: '/images/touch-icon.png',
            token: function token(_token) {
              self._changeSubscription(chosenPlanId, _token);
            }
          }));
          this.get('handler').open({
            name: 'Percy.io',
            description: 'Subscription to ' + planName + ' plan',
            email: this.get('organization.subscription.billingEmail'),
            // This is just for display in Stripe Checkout, the actual charge is handled in the API.
            amount: this.get('price') * 100,
            panelLabel: this.get('checkoutLabelText'),
            allowRememberMe: false
          });
        } else {
          var msg = 'Ready to change to the ' + planName + ' plan? We\'ll use your existing payment info.';
          if (confirm(msg)) {
            self._changeSubscription(chosenPlanId);
          }
        }
      }
    }
  });
});