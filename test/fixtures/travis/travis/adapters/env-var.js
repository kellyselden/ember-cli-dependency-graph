define('travis/adapters/env-var', ['exports', 'travis/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    namespace: 'settings',

    buildURL: function buildURL(type, id, record) {
      var repoId = void 0,
          url = void 0;
      url = this._super.apply(this, arguments);
      if (record && record.belongsTo('repo') && (repoId = record.belongsTo('repo').id)) {
        var delimiter = url.indexOf('?') !== -1 ? '&' : '?';
        url = '' + url + delimiter + 'repository_id=' + repoId;
      }
      return url;
    },
    updateRecord: function updateRecord(store, type, record) {
      var data = void 0,
          serializer = void 0;
      data = {};
      serializer = store.serializerFor(type.modelName);
      serializer.serializeIntoHash(data, type, record);
      var id = record.id;
      return this.ajax(this.buildURL(type.modelName, id, record), 'PATCH', {
        data: data
      });
    }
  });
});