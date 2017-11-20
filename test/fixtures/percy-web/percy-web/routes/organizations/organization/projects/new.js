define('percy-web/routes/organizations/organization/projects/new', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    actions: {
      projectCreated: function projectCreated(project) {
        var organizationSlug = project.get('organization.slug');
        var projectSlug = project.get('slug');
        this.transitionTo('organization.project.index', organizationSlug, projectSlug);
      }
    }
  });
});