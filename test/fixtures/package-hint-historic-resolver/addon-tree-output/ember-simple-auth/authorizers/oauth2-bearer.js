define('ember-simple-auth/authorizers/oauth2-bearer', ['exports', 'ember-simple-auth/authorizers/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = Ember.isEmpty;
  exports.default = _base.default.extend({
    /**
      Includes the access token from the session data into the `Authorization`
      header as a Bearer token, e.g.:
       ```
      Authorization: Bearer 234rtgjneroigne4
      ```
       @method authorize
      @param {Object} data The data that the session currently holds
      @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
      @public
    */
    authorize: function authorize(data, block) {
      var accessToken = data['access_token'];

      if (!isEmpty(accessToken)) {
        block('Authorization', 'Bearer ' + accessToken);
      }
    }
  });
});