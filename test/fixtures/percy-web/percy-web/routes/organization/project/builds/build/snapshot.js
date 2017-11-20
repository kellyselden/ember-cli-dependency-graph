define('percy-web/routes/organization/project/builds/build/snapshot', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'percy-web/mixins/reset-scroll'], function (exports, _authenticatedRouteMixin, _resetScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, _resetScroll.default, {
    params: {},
    queryParams: {
      comparisonMode: { as: 'mode' }
    },
    model: function model(params /*transition*/) {
      this.set('params', params);
      var buildId = this.modelFor('organization.project.builds.build').get('id');
      return this.store.findRecord('build', buildId);
    },
    afterModel: function afterModel(resolvedModel) {
      // Avoids race condition to get snapshots on build in components. Because the underlying
      // lookup is an async relationship, the get triggers a promise which allows route cycle
      // blocking behavior.
      return resolvedModel.get('comparisons');
    },
    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);

      var params = this.get('params');

      controller.setProperties({
        build: model,
        snapshotId: params.snapshot_id,
        snapshotSelectedWidth: params.width,
        comparisonMode: params.comparisonMode
      });
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);
        this.send('updateModalState', true);

        var build = this.modelFor(this.routeName);
        var organization = build.get('project.organization');
        var eventProperties = {
          project_id: build.get('project.id'),
          project_slug: build.get('project.slug'),
          build_id: build.get('id'),
          snapshot_id: this.get('params').snapshot_id
        };
        this.analytics.track('Snapshot Fullscreen Viewed', organization, eventProperties);
      },
      updateComparisonMode: function updateComparisonMode(value) {
        this.controllerFor(this.routeName).set('comparisonMode', value.toString());
      },
      transitionRouteToWidth: function transitionRouteToWidth(snapshot, width, comparisonMode) {
        this.transitionTo('organization.project.builds.build.snapshot', snapshot.id, width, {
          queryParams: { mode: comparisonMode }
        });
      }
    }
  });
});