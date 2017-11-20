define('percy-web/mirage/serializers/project', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    links: function links(project) {
      return {
        tokens: {
          related: '/api/v1/projects/' + project.fullSlug + '/tokens'
        }
      };
    }
  });
});