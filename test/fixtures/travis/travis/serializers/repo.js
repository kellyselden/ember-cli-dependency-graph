define('travis/serializers/repo', ['exports', 'travis/serializers/repo_v2_fallback', 'ember-data/serializers/embedded-records-mixin'], function (exports, _repo_v2_fallback, _embeddedRecordsMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Serializer = _repo_v2_fallback.default.extend(_embeddedRecordsMixin.default, {
    attrs: {
      permissions: { key: '@permissions' }
    },

    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      if (!id && requestType === 'findRecord') {
        id = payload.id;
      }

      return this._super(store, primaryModelClass, payload, id, requestType);
    }
  });

  exports.default = Serializer;
});