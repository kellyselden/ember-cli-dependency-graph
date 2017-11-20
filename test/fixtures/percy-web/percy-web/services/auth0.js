define('percy-web/services/auth0', ['exports', 'ember-simple-auth-auth0/services/auth0'], function (exports, _auth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _auth.default;
    }
  });
});