define('travis/routes/account/repositories', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    queryParams: {
      offset: {
        refreshModel: true
      }
    },

    model: function model(params) {
      var account = this.modelFor('account');
      // account is an Ember-Data model
      if (account.get) {
        return this.store.paginated('repo', {
          offset: params.offset,
          sort_by: 'name',
          limit: 25,
          custom: {
            owner: account.get('login'),
            type: 'byOwner'
          }
        }, {});
      }
    }
  });
});