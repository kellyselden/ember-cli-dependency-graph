define('code-corps-ember/components/github/repo-sync', ['exports', 'code-corps-ember/mixins/repo-sync-progress'], function (exports, _repoSyncProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend(_repoSyncProgress.default, {
    classNames: ['github__repo-sync'],

    githubRepo: null
  });
});