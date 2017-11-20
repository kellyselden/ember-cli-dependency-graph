define('percy-web/models/organization', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var filterBy = Ember.computed.filterBy;
  var alias = Ember.computed.alias;
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr(),
    slug: _emberData.default.attr(),
    githubBotUser: _emberData.default.belongsTo('user', { async: false, inverse: null }),
    githubIntegration: _emberData.default.belongsTo('github-integration', { async: false }),
    githubIntegrationRequest: _emberData.default.belongsTo('github-integration-request', {
      async: false
    }),
    subscription: _emberData.default.belongsTo('subscription', { async: false }),
    projects: _emberData.default.hasMany('project'),
    billingProvider: _emberData.default.attr(),
    billingProviderData: _emberData.default.attr(),
    billingLocked: _emberData.default.attr('boolean'),

    // Filtered down to saved projects, does not include unsaved project objects:
    savedProjects: filterBy('projects', 'isNew', false),

    organizationUsers: _emberData.default.hasMany('organization-user'),

    // These are GitHub repositories that the organization has access permissions to. These are not
    // useful on their own other than for listing. A repo must be linked to a project.
    repos: _emberData.default.hasMany('repo'),

    isGithubIntegrated: computed('githubAuthMechanism', function () {
      return this.get('githubAuthMechanism') !== 'no-access';
    }),
    githubAuthMechanism: computed('githubBotUser', 'githubIntegration', function () {
      if (this.get('githubBotUser')) {
        return 'github-bot-user';
      } else if (this.get('githubIntegration')) {
        return 'github-integration';
      }
      return 'no-access';
    }),

    // A funky, but efficient, way to query the API for only the current user's membership.
    // Use `organization.currentUserMembership` to get the current user's OrganizationUser object.
    currentUserMembership: alias('_filteredOrganizationUsers.firstObject'),
    _filteredOrganizationUsers: computed(function () {
      return this.store.query('organization-user', {
        organization: this,
        filter: 'current-user-only'
      });
    })
  });
});