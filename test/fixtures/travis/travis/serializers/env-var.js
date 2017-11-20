define('travis/serializers/env-var', ['exports', 'travis/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    attrs: {
      repo: { key: 'repository_id' }
    },

    serialize: function serialize(snapshot, options) {
      return { env_var: this._super(snapshot, options) };
    },
    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
      payload = payload.env_var;
      return this._super(store, primaryModelClass, payload, id, requestType);
    }
  });
});