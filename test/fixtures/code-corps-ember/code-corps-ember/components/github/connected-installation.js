define('code-corps-ember/components/github/connected-installation', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var computed = Ember.computed;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['github-app-installation connected'],

    organizationGithubAppInstallation: null,
    project: null,

    githubAppInstallation: alias('organizationGithubAppInstallation.githubAppInstallation'),

    iconUrl: computed('githubAppInstallation.githubAccountAvatarUrl', function () {
      var avatarUrl = get(this, 'githubAppInstallation.githubAccountAvatarUrl');
      return avatarUrl + '&size=80';
    }),

    organization: alias('project.organization'),
    githubRepos: alias('githubAppInstallation.githubRepos')
  });
});