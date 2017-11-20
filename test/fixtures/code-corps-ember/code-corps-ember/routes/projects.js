define('code-corps-ember/routes/projects', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model(params) {
      return this.store.query('project', {
        sluggedRouteSlug: params.slugged_route_slug
      });
    },
    setupController: function setupController(controller, model) {
      controller.set('projects', model);
    }
  });
});