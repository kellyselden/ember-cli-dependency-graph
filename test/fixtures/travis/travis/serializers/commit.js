define('travis/serializers/commit', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v2_fallback.default.extend({
    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash.author && resourceHash.author.name) {
        resourceHash.author_name = resourceHash.author.name;
        resourceHash.author_avatar_url = resourceHash.author.avatar_url;
      }
      if (resourceHash.committer && resourceHash.committer.name) {
        resourceHash.committer_name = resourceHash.committer.name;
        resourceHash.committer_avatar_url = resourceHash.committer.avatar_url;
      }
      return this._super.apply(this, arguments);
    }
  });
});