define('travis/serializers/ssh_key', ['exports', 'travis/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    serialize: function serialize() /* snapshot, options*/{
      return { ssh_key: this._super.apply(this, arguments) };
    },
    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
      payload = payload.ssh_key;
      return this._super(store, primaryModelClass, payload, id, requestType);
    }
  });
});