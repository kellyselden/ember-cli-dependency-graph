define('percy-web/routes/organization/project/builds/build', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    queryParams: {
      activeSnapshotId: { as: 'snapshot', replace: true }
    },
    afterModel: function afterModel(model) {
      model.reload().then(function (model) {
        if (!model.get('isExpired')) {
          // Force reload because these async-hasMany's won't reload themselves if the build's
          // state has changed, such as going from processing --> finished and we don't want to show
          // fewer comparisons than there are.
          model.get('comparisons').reload();
        }
      });
    },
    resetController: function resetController(controller, isExiting) {
      if (isExiting) {
        // Clear the query parameter when exiting the route.
        controller.set('activeSnapshotId', undefined);
      }
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        var build = this.modelFor(this.routeName);
        var organization = build.get('project.organization');
        var eventProperties = {
          project_id: build.get('project.id'),
          project_slug: build.get('project.slug'),
          build_id: build.get('id'),
          state: build.get('state')
        };
        this.analytics.track('Build Viewed', organization, eventProperties);
      },
      updateActiveSnapshotId: function updateActiveSnapshotId(snapshotId) {
        this.set('controller.activeSnapshotId', snapshotId);
      },
      updateModalState: function updateModalState(state) {
        this.get('currentModel').set('isShowingModal', state);
      },
      openSnapshotFullModal: function openSnapshotFullModal(snapshotId, snapshotSelectedWidth) {
        var build = this.modelFor(this.routeName);
        var organization = build.get('project.organization');
        var eventProperties = {
          project_id: build.get('project.id'),
          project_slug: build.get('project.slug'),
          build_id: build.get('id'),
          snapshot_id: snapshotId
        };
        this.analytics.track('Snapshot Fullscreen Selected', organization, eventProperties);

        this.send('updateModalState', true);
        this.transitionTo('organization.project.builds.build.snapshot', snapshotId, snapshotSelectedWidth, {
          queryParams: { mode: 'diff' }
        });
      },
      closeSnapshotFullModal: function closeSnapshotFullModal(buildId, snapshotId) {
        this.send('updateModalState', false);
        this.transitionTo('organization.project.builds.build', buildId, {
          queryParams: { activeSnapshotId: snapshotId }
        });
      }
    }
  });
});