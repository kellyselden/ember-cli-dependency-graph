define('ghost-admin/validators/signup', ['exports', 'ghost-admin/validators/new-user'], function (exports, _newUser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _newUser.default.create();
});