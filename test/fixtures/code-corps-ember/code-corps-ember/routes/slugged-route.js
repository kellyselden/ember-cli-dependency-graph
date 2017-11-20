define('code-corps-ember/routes/slugged-route', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model(params) {
      return this.store.queryRecord('slugged-route', {
        slug: params.slugged_route_slug
      });
    }
  });
});