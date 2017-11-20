define('travis/services/external-links', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    plainTextLog: function plainTextLog(id) {
      return _environment.default.apiEndpoint + '/jobs/' + id + '/log.txt?deansi=true';
    },
    githubPullRequest: function githubPullRequest(slug, pullRequestNumber) {
      return _environment.default.sourceEndpoint + '/' + slug + '/pull/' + pullRequestNumber;
    },
    githubCommit: function githubCommit(slug, sha) {
      return _environment.default.sourceEndpoint + '/' + slug + '/commit/' + sha;
    },
    githubRepo: function githubRepo(slug) {
      return _environment.default.sourceEndpoint + '/' + slug;
    },
    email: function email(_email) {
      return 'mailto:' + _email;
    },
    travisWebBranch: function travisWebBranch(branchName) {
      return 'https://github.com/travis-ci/travis-web/tree/' + branchName;
    },
    githubBranch: function githubBranch(slug, branch) {
      return _environment.default.sourceEndpoint + '/' + slug + '/tree/' + branch;
    },
    billingUrl: function billingUrl(accountType, login) {
      var id = accountType === 'user' ? 'user' : login;
      return _environment.default.billingEndpoint + '/subscriptions/' + id;
    },
    githubTag: function githubTag(slug, tag) {
      return _environment.default.sourceEndpoint + '/' + slug + '/releases/tag/' + tag;
    }
  });
});