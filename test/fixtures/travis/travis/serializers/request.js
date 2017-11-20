define('travis/serializers/request', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Serializer = _v2_fallback.default.extend({

    keyForV2Relationship: function keyForV2Relationship(key /* , typeClass, method*/) {
      if (key === 'repo') {
        return 'repository_id';
      } else {
        return this._super.apply(this, arguments);
      }
    },

    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      if (payload.commits) {
        payload.requests.forEach(function (request) {
          var commit = commit = payload.commits.findBy('id', request.commit_id);
          if (commit) {
            request.commit = commit;
            return delete request.commit_id;
          }
        });
      }
      return this._super.apply(this, arguments);
    }
  });

  exports.default = Serializer;
});