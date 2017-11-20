define('percy-web/mirage/serializers/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    links: function links(user) {
      return {
        organizations: {
          related: '/api/v1/users/' + user.id + '/organizations'
        }
      };
    }
  });
});