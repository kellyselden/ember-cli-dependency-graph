define('travis/mirage/factories/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    name: 'Test User',
    email: 'test@travis-ci.com',
    correct_scopes: true,
    login: 'testuser',
    synced_at: '2016-01-01T23:04:31Z'
  });
});