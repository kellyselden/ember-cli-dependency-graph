define('travis/mirage/factories/repository', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.default.Factory.extend({
    name: 'travis-web',
    githubLanguage: 'ruby',
    active: true,

    owner: {
      login: 'travis-ci'
    },

    permissions: {
      read: false,
      activate: false,
      deactivate: false,
      star: false,
      unstar: false,
      create_request: false,
      create_cron: false,
      change_settings: false,
      admin: false
    },

    customSshKey: {
      description: 'Custom',
      fingerprint: 'dd:cc:bb:aa',
      type: 'custom'
    },

    defaultSshKey: {
      type: 'default',
      fingerprint: 'aa:bb:cc:dd',
      description: 'Default'
    },

    slug: function slug() {
      return this.owner.login + '/' + this.name;
    },

    afterCreate: function afterCreate(repository, server) {
      if (!repository.attrs.skipPermissions) {
        // Creates permissions for first user in the database
        // TODO: I'd like to remove it at some point as this is unexpected
        // we should set up permissions as needed. Possibly whenever we fully
        // switch to permissions from V3
        var user = server.schema.users.all().models[0];
        server.create('permissions', { user: user, repository: repository });
      }
    }
  });
});