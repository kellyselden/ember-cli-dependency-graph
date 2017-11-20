define('travis/serializers/build', ['exports', 'travis/serializers/build_v2_fallback'], function (exports, _build_v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _build_v2_fallback.default.extend({
    attrs: {
      _config: { key: 'config' },
      _duration: { key: 'duration' }
    },

    keyForRelationship: function keyForRelationship(key /* , typeClass, method*/) {
      if (key === 'repo') {
        return 'repository';
      } else {
        return this._super.apply(this, arguments);
      }
    },


    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash['event_type'] == 'pull_request' && !resourceHash.hasOwnProperty('pull_request')) {
        // in V3 we don't return "pull_request" property as we rely on event_type
        // value. This line makes V3 payloads also populate pull_request property
        resourceHash['pull_request'] = true;
      }

      return this._super(modelClass, resourceHash);
    }
  });
});