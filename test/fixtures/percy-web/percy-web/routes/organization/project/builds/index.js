define('percy-web/routes/organization/project/builds/index', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    redirect: function redirect() {
      var organizationSlug = this.modelFor('organization').get('slug');
      var projectSlug = this.modelFor('organization.project').get('slug');
      this.transitionTo('organization.project.index', organizationSlug, projectSlug);
    }
  });
});