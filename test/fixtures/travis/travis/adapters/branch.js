define('travis/adapters/branch', ['exports', 'travis/adapters/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    query: function query(store, type, _query) {
      var repoId = _query.repository_id;
      delete _query.repository_id;
      var url = this.urlPrefix() + '/repo/' + repoId + '/branches';
      return this.ajax(url, 'GET', _query);
    },
    findRecord: function findRecord(store, type, id) {
      return this.ajax(this.urlPrefix() + id, 'GET');
    }
  });
});