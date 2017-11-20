define('percy-web/components/organizations/billing-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    isSaving: null,
    isSaveSuccessful: null,

    subscriptionData: service(),
    classNames: ['OrganizationsBillingSection'],
    classNameBindings: ['classes'],
    adminMode: service(),
    showCancel: computed('organization.subscription.isCustomer', function () {
      var isCustomer = this.get('organization.subscription.isCustomer');
      return isCustomer && this.get('adminMode').get() == 'admin';
    }),
    actions: {
      changingSubscription: function changingSubscription(savingPromise) {
        var _this = this;

        this.set('isSaveSuccessful', null);
        this.set('isSaving', true);
        savingPromise.then(function () {
          _this.set('isSaving', false);
          _this.set('isSaveSuccessful', true);
        }, function () {
          _this.set('isSaving', false);
          _this.set('isSaveSuccessful', false);
        });
      },
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      }
    }
  });
});