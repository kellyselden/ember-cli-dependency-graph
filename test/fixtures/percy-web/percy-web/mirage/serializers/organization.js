define('percy-web/mirage/serializers/organization', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    include: ['subscription', 'githubIntegration'],
    links: function links(organization) {
      return {
        projects: {
          related: '/api/v1/organizations/' + organization.slug + '/projects'
        },
        subscription: {
          related: '/api/v1/organizations/' + organization.slug + '/subscription'
        }
      };
    }
  });
});