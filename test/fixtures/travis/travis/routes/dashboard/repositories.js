define('travis/routes/dashboard/repositories', ['exports', 'travis/routes/basic', 'travis/utils/dashboard-repositories-sort'], function (exports, _basic, _dashboardRepositoriesSort) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var hash = Ember.RSVP.hash;
  exports.default = _basic.default.extend({
    queryParams: {
      filter: {
        replace: true
      },
      offset: {
        refreshModel: true
      }
    },

    redirect: function redirect() {
      if (!this.get('features.dashboard')) {
        return this.transitionTo('index');
      }
    },
    model: function model(params) {
      return hash({
        starredRepos: this.store.filter('repo', {
          active: true,
          sort_by: 'current_build:desc',
          starred: true
        }, function (repo) {
          return repo.get('starred');
        }, ['starred'], true),
        repos: this.store.paginated('repo', {
          active: true,
          sort_by: 'current_build:desc',
          offset: params.offset
        }, {
          filter: function filter(repo) {
            return repo.get('active') && repo.get('isCurrentUserACollaborator');
          },
          sort: _dashboardRepositoriesSort.default,
          dependencies: ['active', 'isCurrentUserACollaborator'],
          forceReload: true
        }),
        accounts: this.store.filter('account', {
          all: true
        }, function () {
          return true;
        }, [], true)
      });
    },
    afterModel: function afterModel(model) {
      var repos = model.repos;

      // This preloads related models to prevent a backtracking rerender error.
      return hash({
        currentBuilds: repos.map(function (repo) {
          return repo.get('currentBuild');
        }),
        defaultBranches: repos.map(function (repo) {
          return repo.get('defaultBranch');
        })
      });
    }
  });
});