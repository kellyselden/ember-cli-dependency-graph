define('code-corps-ember/controllers/project/settings/integrations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var computed = Ember.computed;
  var get = Ember.get;
  var getProperties = Ember.getProperties;
  var set = Ember.set;
  var alias = Ember.computed.alias;
  var mapBy = Ember.computed.mapBy;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    flashMessages: service(),
    store: service(),

    organization: alias('project.organization'),
    organizationGithubAppInstallations: alias('organization.organizationGithubAppInstallations'),

    userInstallations: alias('user.githubAppInstallations'),
    connectedInstallations: mapBy('organizationGithubAppInstallations', 'githubAppInstallation'),

    unconnectedInstallations: computed('userInstallations', 'connectedInstallations', function () {
      var _getProperties = getProperties(this, 'userInstallations', 'connectedInstallations'),
          userInstallations = _getProperties.userInstallations,
          connectedInstallations = _getProperties.connectedInstallations;

      var connectedInstallationIds = connectedInstallations.map(function (installation) {
        return get(installation, 'id');
      });

      return userInstallations.filter(function (installation) {
        return connectedInstallationIds.indexOf(get(installation, 'id')) === -1;
      });
    }),

    actions: {
      /**
       * Connects an organization to a githubAppInstallation by creating a
       * through record called orgaizationGithubAppInstallation
       *
       * Triggered when user clicks a button to install the GitHub App
       *
       * @method connect
       * @param  {DS.Model} organization The organization to connect an installation with
       * @param  {DS.Model} githubAppInstallation The installation to connect an organization with
       */
      connect: function connect(organization, githubAppInstallation) {
        var store = get(this, 'store');
        var record = store.createRecord('organizationGithubAppInstallation', { organization: organization, githubAppInstallation: githubAppInstallation });

        return record.save();
      },


      /**
       * Disconnects an organization from a githubAppInstallation by deleting the
       * specified organizationGithubAppInstallation
       *
       * Triggered when user clicks a button to "remove" the GitHub App
       *
       * @method disconnect
       * @param  {DS.Model} organizationGithubAppInstallation The link record that gets deleted
       */
      disconnect: function disconnect(organizationGithubAppInstallation) {
        var _this = this;

        return organizationGithubAppInstallation.destroyRecord().then(function () {
          get(_this, 'flashMessages').clearMessages().success('Your installation was removed.');
        });
      },
      connectRepo: function connectRepo(githubRepo, project) {
        set(githubRepo, 'project', project);
        return githubRepo.save();
      },
      disconnectRepo: function disconnectRepo(githubRepo) {
        var _this2 = this;

        set(githubRepo, 'project', null);
        return githubRepo.save().then(function () {
          get(_this2, 'flashMessages').clearMessages().success('Your GitHub repository is no longer syncing.');
          window.scrollTo(0, 0);
        });
      }
    }
  });
});