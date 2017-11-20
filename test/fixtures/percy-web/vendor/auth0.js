(function() {
  /* global define */
  define('auth0', [], function() {
    'use strict';

    // Handle auth0.js v8.x.x
    if (window.auth0 && window.auth0.WebAuth) {
      return { default: window.auth0 };
    }

    return { default: window.Auth0 };
  });
})();
