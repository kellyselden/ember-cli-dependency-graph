define('percy-web/authenticators/auth0-lock-passwordless', ['exports', 'ember-simple-auth-auth0/authenticators/auth0-lock-passwordless'], function (exports, _auth0LockPasswordless) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _auth0LockPasswordless.default;
    }
  });
});