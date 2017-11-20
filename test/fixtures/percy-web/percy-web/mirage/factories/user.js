define('percy-web/mirage/factories/user', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    email: function email(i) {
      return 'user-' + i + '@domain.com';
    },
    name: function name(i) {
      return 'Fake User ' + i;
    },
    login: function login(i) {
      return 'user-' + i;
    },
    avatarUrl: function avatarUrl() {
      return 'https://avatars2.githubusercontent.com/u/12261879?v=3&s=400';
    },
    createdAt: function createdAt() {
      return (0, _moment.default)();
    }
  });
});