define('percy-web/authorizers/jwt', ['exports', 'ember-simple-auth-auth0/authorizers/jwt'], function (exports, _jwt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _jwt.default;
    }
  });
});