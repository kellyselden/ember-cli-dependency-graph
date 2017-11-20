define('percy-web/components/forms/organization-new', ['exports', 'percy-web/components/forms/base', 'percy-web/validations/organization-new'], function (exports, _base, _organizationNew) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  exports.default = _base.default.extend({
    marketplaceListingPlanId: null,
    classes: null,

    classNames: ['FormsOrganizationNew', 'Form'],
    classNameBindings: ['classes'],

    // Setup data for creating an org from different billing providers and marketplaces.
    _billingProvider: computed('marketplaceListingPlanId', function () {
      var marketplaceListingPlanId = this.get('marketplaceListingPlanId');
      if (marketplaceListingPlanId) {
        return 'github_marketplace';
      }
    }),
    _billingProviderData: computed('marketplaceListingPlanId', function () {
      var marketplaceListingPlanId = this.get('marketplaceListingPlanId');
      if (marketplaceListingPlanId) {
        return JSON.stringify({
          marketplace_listing_plan_id: parseInt(marketplaceListingPlanId)
        });
      }
    }),

    model: computed(function () {
      return this.get('store').createRecord('organization', {
        billingProvider: this.get('_billingProvider'),
        billingProviderData: this.get('_billingProviderData')
      });
    }),
    validator: _organizationNew.default
  });
});