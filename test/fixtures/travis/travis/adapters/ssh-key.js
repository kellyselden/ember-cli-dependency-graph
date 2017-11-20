define('travis/adapters/ssh-key', ['exports', 'travis/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    namespace: 'settings',

    urlPrefix: function urlPrefix() {
      var prefix = this._super.apply(this, arguments);

      if (prefix.indexOf('http') === -1) {
        return '/' + prefix;
      } else {
        return prefix;
      }
    },
    findRecord: function findRecord(store, type, id) {
      var url = this.urlPrefix() + '/ssh_key/' + id;
      return this.ajax(url, 'GET');
    },
    deleteRecord: function deleteRecord(store, type, record) {
      var url = this.urlPrefix() + '/ssh_key/' + record.id;
      return this.ajax(url, 'DELETE');
    },
    createRecord: function createRecord(store, type, record) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);
      serializer.serializeIntoHash(data, type, record, {
        includeId: true
      });

      var url = this.urlPrefix() + '/ssh_key/' + record.id;
      return this.ajax(url, 'PATCH', { data: data });
    }
  });
});