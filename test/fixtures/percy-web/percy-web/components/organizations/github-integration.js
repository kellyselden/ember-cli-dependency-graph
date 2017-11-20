define('percy-web/components/organizations/github-integration', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    currentIntegration: alias('organization.githubIntegration'),
    classNames: ['OrganizationsGithubIntegration'],
    classNameBindings: ['classes'],
    actions: {
      cancelIntegrationRequest: function cancelIntegrationRequest() {
        this.sendAction('cancelIntegrationRequest');
      }
    }
  });
});