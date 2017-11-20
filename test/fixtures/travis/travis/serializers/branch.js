define('travis/serializers/branch', ['exports', 'travis/serializers/v2_fallback'], function (exports, _v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v2_fallback.default.extend({
    extractAttributes: function extractAttributes(klass, payload) {
      payload.id = payload['@href'];
      return this._super.apply(this, arguments);
    },
    extractId: function extractId(modelClass, resourceHash) {
      return resourceHash.id || resourceHash['@href'];
    }
  });
});