define('travis/serializers/repo_v2_fallback', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Serializer = _v2_fallback.default.extend({
    normalize: function normalize(modelClass, resourceHash) {
      if (!resourceHash['@type']) {
        var slug = resourceHash.slug;

        if (slug && !resourceHash.name) {
          resourceHash.name = slug.split('/')[1];
        }

        if (slug && !resourceHash.owner) {
          resourceHash.owner = { login: slug.split('/')[0] };
        }
      }

      return this._super(modelClass, resourceHash);
    }
  });

  exports.default = Serializer;
});