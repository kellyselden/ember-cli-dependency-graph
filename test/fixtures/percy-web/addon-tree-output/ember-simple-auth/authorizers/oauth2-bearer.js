define('ember-simple-auth/authorizers/oauth2-bearer', ['exports', 'ember', 'ember-simple-auth/authorizers/base'], function (exports, _ember, _emberSimpleAuthAuthorizersBase) {
  var isEmpty = _ember['default'].isEmpty;

  /**
    Authorizer that conforms to OAuth 2
    ([RFC 6749](http://tools.ietf.org/html/rfc6749)); includes the access token
    from the session data as a bearer token
    ([RFC 6750](http://tools.ietf.org/html/rfc6750)) in the `Authorization`
    header, e.g.:
  
    ```
    Authorization: Bearer 234rtgjneroigne4
    ```
  
    @class OAuth2BearerAuthorizer
    @module ember-simple-auth/authorizers/oauth2-bearer
    @extends BaseAuthorizer
    @public
  */
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
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
/* jscs:disable requireDotNotation */