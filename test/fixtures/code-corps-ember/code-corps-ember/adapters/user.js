define('code-corps-ember/adapters/user', ['exports', 'code-corps-ember/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = _application.default.extend({
    currentUser: service(),

    buildURL: function buildURL(modelName, id, snapshot, requestType) {
      if (requestType === 'updateRecord') {
        if (id === get(this, 'currentUser.user.id')) {
          return this.urlForProfileEdit();
        }
      }
      return this._super.apply(this, arguments);
    },
    urlForProfileEdit: function urlForProfileEdit() {
      var url = [];
      var host = get(this, 'host');
      var prefix = this.urlPrefix();

      url.push(encodeURIComponent('users'));
      url.push(encodeURIComponent(get(this, 'currentUser.user.id')));

      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');
      if (!host && url) {
        url = '/' + url;
      }

      return url;
    }
  });
});