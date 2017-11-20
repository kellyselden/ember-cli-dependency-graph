define('percy-web/routes/organizations/new', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    queryParams: {
      marketplaceListingPlanId: { as: 'marketplace_listing_plan_id', replace: true }
    },
    actions: {
      organizationCreated: function organizationCreated(organization) {
        this.transitionTo('organizations.organization.setup', organization.get('slug'));
      }
    }
  });
});