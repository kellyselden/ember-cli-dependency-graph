define('travis/adapters/cron', ['exports', 'travis/adapters/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    createRecord: function createRecord(store, type, record) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);
      serializer.serializeIntoHash(data, type, record, {});

      var url = '' + this.getHost() + data.branch + '/cron';
      return this.ajax(url, 'POST', {
        data: {
          dont_run_if_recent_build_exists: data.dont_run_if_recent_build_exists,
          interval: data.interval
        }
      });
    },
    query: function query(store, type, _query) {
      var repoId = _query['repository_id'];
      delete _query['repository_id'];
      var url = this.urlPrefix() + '/repo/' + repoId + '/crons';
      return this.ajax(url, 'GET', _query);
    }
  });
});