define('percy-web/routes/organization/project/index', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'percy-web/mixins/reset-scroll'], function (exports, _authenticatedRouteMixin, _resetScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, _resetScroll.default, {
    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        var project = this.modelFor(this.routeName);
        var organization = project.get('organization');
        var eventProperties = {
          project_id: project.get('id'),
          project_slug: project.get('slug')
        };
        this.analytics.track('Project Viewed', organization, eventProperties);

        // If transitioning back to this page after first load, background reload the builds.
        if (project.get('builds').isFulfilled) {
          project.get('builds').reload();
        }
      }
    }
  });
});