define('percy-web/mirage/serializers/build', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    links: function links(build) {
      return {
        snapshots: {
          related: '/api/v1/builds/' + build.id + '/snapshots'
        },
        comparisons: {
          related: '/api/v1/builds/' + build.id + '/comparisons'
        }
      };
    }
  });
});