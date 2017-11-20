define('travis/adapters/repo', ['exports', 'travis/adapters/v3', 'travis/config/environment'], function (exports, _v, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var apiEndpoint = _environment.default.apiEndpoint;
  exports.default = _v.default.extend({
    defaultSerializer: '-repo',

    includes: 'build.branch,repository.default_branch' + ',repository.current_build,build.commit',

    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      if (query) {
        var custom = query.custom;
        if (custom && custom.type === 'byOwner') {
          var owner = custom.owner;

          return apiEndpoint + '/owner/' + owner + '/repos';
        }
      }
      return this._super.apply(this, arguments);
    },
    activate: function activate(id) {
      var url = apiEndpoint + '/repo/' + id + '/activate';
      return this.ajax(url, 'POST');
    },
    deactivate: function deactivate(id) {
      var url = apiEndpoint + '/repo/' + id + '/deactivate';
      return this.ajax(url, 'POST');
    }
  });
});