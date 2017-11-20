define('code-corps-ember/components/github/repo-disconnect-confirm-modal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var get = Ember.get;
  var alias = Ember.computed.alias;
  var not = Ember.computed.not;
  exports.default = Component.extend({
    classNames: ['github__repo-disconnect-confirm-modal'],

    githubRepo: null,
    typedGithubRepoName: '',

    githubRepoName: alias('githubRepo.name'),
    namesMatch: computed('githubRepoName', 'typedGithubRepoName', function () {
      var githubRepoName = get(this, 'githubRepoName');
      var typedGithubRepoName = get(this, 'typedGithubRepoName');
      return githubRepoName === typedGithubRepoName;
    }),
    submitDisabled: not('namesMatch'),

    actions: {
      disconnect: function disconnect() {
        this.sendAction('disconnect');
      }
    }
  });
});