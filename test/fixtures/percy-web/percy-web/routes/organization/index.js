define('percy-web/routes/organization/index', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    redirect: function redirect() {
      this.send('redirectToDefaultOrganization');
    },
    afterModel: function afterModel(model) {
      model.get('projects').reload();
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        var organization = this.modelFor(this.routeName);
        this.analytics.track('Dashboard Viewed', organization);
      }
    }
  });
});