define('travis/serializers/build_v2_fallback', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v2_fallback.default.extend({
    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      if (!payload['@type'] && payload.commit) {
        payload.build.commit = payload.commit;
        delete payload.build.commit_id;
      }
      return this._super.apply(this, arguments);
    },

    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      if (payload.commits) {
        payload.builds.forEach(function (build) {
          var commit = payload.commits.findBy('id', build.commit_id);
          if (commit) {
            build.commit = commit;
            return delete build.commit_id;
          }
        });
      }
      return this._super.apply(this, arguments);
    },

    keyForV2Relationship: function keyForV2Relationship(key /* , typeClass, method*/) {
      if (key === 'jobs') {
        return 'job_ids';
      } else if (key === 'repo') {
        return 'repository_id';
      } else if (key === 'commit') {
        return key;
      } else {
        return this._super.apply(this, arguments);
      }
    },

    normalize: function normalize(modelClass, resourceHash) {
      // TODO: remove this after switching to V3 entirely
      var type = resourceHash['@type'];
      var commit = resourceHash.commit;
      if (!type && commit && commit.hasOwnProperty('branch_is_default')) {
        var build = resourceHash.build,
            _commit = resourceHash.commit;
        var branch = {
          name: _commit.branch,
          default_branch: _commit.branch_is_default,
          '@href': '/repo/' + build.repository_id + '/branch/' + _commit.branch
        };
        resourceHash.build.branch = branch;
      }

      // fix pusher payload, it doesn't include a branch record:
      if (!type && resourceHash.build && resourceHash.repository && resourceHash.repository.default_branch) {
        var branchName = resourceHash.commit.branch,
            repository = resourceHash.repository,
            defaultBranchName = repository.default_branch.name;

        resourceHash.build.branch = {
          name: branchName,
          default_branch: branchName === defaultBranchName,
          '@href': '/repo/' + repository.id + '/branch/' + branchName
        };

        repository.default_branch['@href'] = '/repo/' + repository.id + '/branch/' + defaultBranchName;
      }

      return this._super(modelClass, resourceHash);
    }
  });
});