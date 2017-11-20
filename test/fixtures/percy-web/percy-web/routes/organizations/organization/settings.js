define('percy-web/routes/organizations/organization/settings', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getOwner = Ember.getOwner;
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        var organization = this.modelFor(this.routeName);
        this.analytics.track('Settings Viewed', organization);
      },
      organizationUpdated: function organizationUpdated(organization) {
        // If an organization slug changes, we prefer to reload the entire application
        // to prevent odd bugs, since we rely on the org slug for basically everything.
        var router = getOwner(this).lookup('router:main');
        var destinationUrl = router.generate('organization', organization.get('slug'));
        window.location.href = destinationUrl;
      }
    }
  });
});