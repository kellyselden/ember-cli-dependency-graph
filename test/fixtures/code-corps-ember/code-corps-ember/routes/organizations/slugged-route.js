define('code-corps-ember/routes/organizations/slugged-route', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    model: function model(params) {
      return this.store.queryRecord('slugged-route', {
        slug: params.slugged_route_slug
      }).then(function (slugged_route) {
        return slugged_route.get('organization');
      });
    }
  });
});