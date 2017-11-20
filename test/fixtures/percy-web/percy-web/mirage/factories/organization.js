define('percy-web/mirage/factories/organization', ['exports', 'moment', 'ember-cli-mirage'], function (exports, _moment, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    name: function name(i) {
      return 'My Organization ' + i;
    },
    slug: function slug() {
      return this.name.underscore();
    },
    afterCreate: function afterCreate(organization, server) {
      if (!organization.subscription) {
        server.create('subscription', { organization: organization });
      }
    },


    withTrial: (0, _emberCliMirage.trait)({
      afterCreate: function afterCreate(organization, server) {
        server.create('subscription', {
          organization: organization,
          trialStart: (0, _moment.default)(),
          trialEnd: (0, _moment.default)().add(14, 'days').add(1, 'hour'),
          plan: server.create('plan', 'trial')
        });
      }
    }),

    withUser: (0, _emberCliMirage.trait)({
      afterCreate: function afterCreate(organization, server) {
        var user = server.create('user');
        server.create('organizationUser', { user: user, organization: organization, role: 'member' });
      }
    }),

    withAdminUser: (0, _emberCliMirage.trait)({
      afterCreate: function afterCreate(organization, server) {
        var user = server.create('user');
        server.create('organizationUser', { user: user, organization: organization, role: 'admin' });
      }
    }),

    withGithubIntegration: (0, _emberCliMirage.trait)({
      afterCreate: function afterCreate(organization, server) {
        if (organization.githubIntegration === null) {
          var githubIntegration = server.create('githubIntegration');
          organization.update({ githubIntegration: githubIntegration });
        }
      }
    })
  });
});