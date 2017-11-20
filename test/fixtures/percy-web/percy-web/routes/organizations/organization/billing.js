define('percy-web/routes/organizations/organization/billing', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    // Important: this model loads extra includes, so it requires that we're always using .slug when
    // using link-to into this route so that the model hook always fires. :( Ember 3!
    model: function model() {
      var organization = this.modelFor('organizations.organization');
      var includes = 'subscription.current-usage-stats';
      return this.store.findRecord('organization', organization.id, { include: includes });
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);
        var organization = this.modelFor('organizations.organization');
        this.analytics.track('Billing Viewed', organization);
      }
    }
  });
});