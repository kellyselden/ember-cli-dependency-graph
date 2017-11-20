define('code-corps-ember/routes/project', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model(params) {
      return this.store.queryRecord('project', {
        slug: params.project_slug,
        sluggedRouteSlug: params.slugged_route_slug
      }, { reload: true });
    },
    serialize: function serialize(model) {
      return {
        slugged_route_slug: model.get('organization.slug'),
        project_slug: model.get('slug')
      };
    }
  });
});