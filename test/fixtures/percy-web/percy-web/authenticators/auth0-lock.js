define('percy-web/authenticators/auth0-lock', ['exports', 'ember-simple-auth-auth0/authenticators/auth0-lock'], function (exports, _auth0Lock) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _auth0Lock.default;
    }
  });
});