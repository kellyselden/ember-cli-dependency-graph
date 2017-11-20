define('code-corps-ember/routes/project/settings', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember-can'], function (exports, _authenticatedRouteMixin, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, _emberCan.CanMixin, {
    projectSkillsList: service(),
    session: service(),

    model: function model() {
      return this.modelFor('project').reload();
    },
    beforeModel: function beforeModel() {
      // we need to deal with overriding the `AuthenticatedRouteMixin`
      var isAuthenticated = get(this, 'session.isAuthenticated');

      if (isAuthenticated) {
        return this._ensureUserHasCredentials.apply(this, arguments);
      } else {
        // call `beforeModel` in `AuthenticatedRouteMixin`
        return this._super.apply(this, arguments);
      }
    },
    afterModel: function afterModel(project) {
      get(this, 'projectSkillsList').setProject(project);
    },
    _ensureUserHasCredentials: function _ensureUserHasCredentials() {
      var _this = this;

      var project = this.modelFor('project');
      // TODO: As things grow, this will be problematic. We need to wait to load
      // all project user records here. Solutions are
      // 1. Sideload project user records
      // 2. Have the server compute an ability table for the current user
      return get(project, 'projectUsers').then(function () {
        if (_this.cannot('manage project', project)) {
          return _this.transitionTo('project');
        }
      });
    }
  });
});