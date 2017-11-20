define('percy-web/routes/organization/project/settings', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    actions: {
      projectUpdated: function projectUpdated(project) {
        // If project slug changed, redirect to new URL slug:
        var projectSlug = project.get('slug');
        var organizationSlug = project.get('organization.slug');
        this.transitionTo('organization.project.index', organizationSlug, projectSlug);
      }
    }
  });
});