define('percy-web/routes/organization/project', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    model: function model(params) {
      var organizationSlug = this.modelFor('organization').get('slug');
      return this.store.findRecord('project', organizationSlug + '/' + params.project_id);
    }
  });
});