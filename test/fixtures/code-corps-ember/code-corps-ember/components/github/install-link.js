define('code-corps-ember/components/github/install-link', ['exports', 'code-corps-ember/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    githubAppUrl: _environment.default.github.appUrl,

    metrics: service(),

    organization: null,
    project: null,

    installUrl: computed('githubAppUrl', function () {
      return get(this, 'githubAppUrl') + '/installations/new';
    }),

    actions: {
      trackClick: function trackClick() {
        var organizationId = get(this, 'organization.id');
        var organizationName = get(this, 'organization.name');
        var projectId = get(this, 'project.id');
        var projectTitle = get(this, 'project.title');
        get(this, 'metrics').trackEvent({
          event: 'Clicked Install GitHub Application',
          organization: organizationName,
          organization_id: organizationId,
          project: projectTitle,
          project_id: projectId
        });
      }
    }
  });
});