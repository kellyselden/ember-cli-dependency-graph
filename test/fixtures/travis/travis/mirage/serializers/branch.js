define('travis/mirage/serializers/branch', ['exports', 'travis/mirage/serializers/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    serializeSingle: function serializeSingle(branch) {
      var builds = branch.builds;

      if (!branch.lastBuild && builds && builds.models.length) {
        branch.lastBuild = builds.models[builds.models.length - 1];
      }

      return _v.default.prototype.serializeSingle.apply(this, arguments);
    },
    hrefForSingle: function hrefForSingle(type, model, request) {
      // TODO: do we need to try request? it seems like branch should always
      // belong to a repository
      var repositoryId = request.params.repository_id || request.params.repo_id || model.repository && model.repository.id;

      return '/repo/' + repositoryId + '/branch/' + model.attrs.name;
    },
    hrefForCollection: function hrefForCollection(type, collection, request) {
      var repositoryId = request.params.repository_id || collection.models.length && collection.models[0].repository.id;

      return '/repo/' + repositoryId + '/branches';
    },
    normalizeId: function normalizeId() {
      // branches don't have id in our API
      return null;
    }
  });
});