define('travis/adapters/build', ['exports', 'travis/adapters/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    includes: 'build.commit,build.branch,build.jobs',

    pathPrefix: function pathPrefix(modelName, id, snapshot, type, query) {
      if (type === 'query' && query.repository_id) {
        return 'repo/' + query.repository_id;
      }
    },
    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      if (requestType == 'queryRecord' && query.id) {
        var _id = query.id;
        delete query.id;
        return this._super(modelName, _id, snapshot, 'findRecord', query);
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });
});