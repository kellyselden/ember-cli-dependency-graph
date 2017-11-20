define('travis/serializers/job_v2_fallback', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v2_fallback.default.extend({
    keyForV2Relationship: function keyForV2Relationship(key /* , typeClass, method*/) {
      if (key === 'repo') {
        return 'repository_id';
      } else {
        return this._super.apply(this, arguments);
      }
    },
    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash.commit) {
        resourceHash.commit['type'] = 'commit';
      }

      return this._super(modelClass, resourceHash);
    },


    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      if (!payload['@type'] && payload.commit) {
        payload.job.commit = payload.commit;
        delete payload.job.commit_id;
      }
      return this._super.apply(this, arguments);
    },

    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      if (payload.commits) {
        payload.jobs.forEach(function (job) {
          var commit = payload.commits.findBy('id', job.commit_id);
          if (commit) {
            job.commit = commit;
            return delete job.commit_id;
          }
        });
      }
      return this._super.apply(this, arguments);
    }

  });
});