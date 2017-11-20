define('travis/routes/account', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    titleToken: function titleToken(account) {
      if (account && account.id) {
        return account.get('name') || account.get('login');
      } else {
        return 'Account';
      }
    },
    model: function model(params) {
      var login = params.login;

      var account = this.modelFor('accounts').find(function (acct) {
        return acct.get('login') === login;
      });
      if (account) {
        return account;
      }
      return {
        login: login,
        error: true
      };
    },
    serialize: function serialize(account) {
      if (account && account.get) {
        return {
          login: account.get('login')
        };
      } else {
        return {};
      }
    }
  });
});