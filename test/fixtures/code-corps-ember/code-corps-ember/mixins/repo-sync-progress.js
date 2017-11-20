define('code-corps-ember/mixins/repo-sync-progress', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var notEmpty = Ember.computed.notEmpty;
  var Mixin = Ember.Mixin;
  var computed = Ember.computed;
  var get = Ember.get;


  var TOTAL_STEPS = 10;

  exports.default = Mixin.create({
    githubRepo: null,

    errored: computed('state', function () {
      var state = get(this, 'state');
      return state && state.indexOf('error') > -1;
    }),

    hasProject: notEmpty('githubRepo.project.id'),

    percentage: computed('stepNumber', function () {
      var stepNumber = get(this, 'stepNumber');
      return stepNumber / TOTAL_STEPS * 100;
    }),

    state: alias('githubRepo.syncState'),

    stepNumber: computed('state', function () {
      var state = get(this, 'state');

      switch (state) {
        case 'unsynced':
          return 0;
        case 'fetching_pull_requests':
        case 'errored_fetching_pull_requests':
          return 1;
        case 'syncing_github_pull_requests':
        case 'errored_syncing_github_pull_requests':
          return 2;
        case 'fetching_issues':
        case 'errored_fetching_issues':
          return 3;
        case 'syncing_github_issues':
        case 'errored_syncing_github_issues':
          return 4;
        case 'fetching_comments':
        case 'errored_fetching_comments':
          return 5;
        case 'syncing_github_comments':
        case 'errored_syncing_github_comments':
          return 6;
        case 'syncing_users':
        case 'errored_syncing_users':
          return 7;
        case 'syncing_tasks':
        case 'errored_syncing_tasks':
          return 8;
        case 'syncing_comments':
        case 'errored_syncing_comments':
          return 9;
        case 'synced':
          return 10;
        default:
          return 0;
      }
    }),

    syncing: computed('errored', 'stepNumber', function () {
      var errored = get(this, 'errored');
      var stepNumber = get(this, 'stepNumber');
      return !errored && TOTAL_STEPS - stepNumber >= 1;
    }),

    syncComplete: computed('state', function () {
      return get(this, 'state') === 'synced';
    }),

    syncInProgress: computed('hasProject', 'syncComplete', function () {
      var hasProject = get(this, 'hasProject');
      var syncComplete = get(this, 'syncComplete');

      return hasProject && !syncComplete;
    })
  });
});