define('ember-simple-auth-token/authorizers/token', ['exports', 'ember', 'ember-simple-auth/authorizers/base', 'ember-simple-auth-token/configuration'], function (exports, _ember, _emberSimpleAuthAuthorizersBase, _emberSimpleAuthTokenConfiguration) {

  /**
    Authorizer that works with token-based authentication like JWT
    by sending the `token` properties from the session in the `Authorization` header.
  
    _The factory for this authorizer is registered as
    `'authorizer:token'` in Ember's container._
  
    @class Token
    @namespace SimpleAuth.Authorizers
    @module ember-simple-auth-token/authorizers/token
    @extends Base
  */
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
    session: _ember['default'].inject.service('session'),

    /**
      The prefix used in the value of the Authorization header.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#authorizationPrefix`](#SimpleAuth-Configuration-Token-authorizationPrefix).
       @property authorizationPrefix
      @type String
      @default 'Bearer '
    */
    authorizationPrefix: 'Bearer ',

    /**
      The name of the property in session that contains token used for authorization.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#tokenPropertyName`](#SimpleAuth-Configuration-Token-tokenPropertyName).
       @property tokenPropertyName
      @type String
      @default 'token'
    */
    tokenPropertyName: 'token',

    /**
      The name of the HTTP Header used to send token.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#authorizationHeaderName`](#SimpleAuth-Configuration-Token-authorizationHeaderName).
       @property authorizationHeaderName
      @type String
      @default 'Authorization'
    */
    authorizationHeaderName: 'Authorization',

    /**
      @method init
      @private
    */
    init: function init() {
      this.tokenPropertyName = _emberSimpleAuthTokenConfiguration['default'].tokenPropertyName;
      this.authorizationHeaderName = _emberSimpleAuthTokenConfiguration['default'].authorizationHeaderName;

      if (_emberSimpleAuthTokenConfiguration['default'].authorizationPrefix || _emberSimpleAuthTokenConfiguration['default'].authorizationPrefix === null) {
        this.authorizationPrefix = _emberSimpleAuthTokenConfiguration['default'].authorizationPrefix;
      }
    },

    /**
      Authorizes an XHR request by sending the `token`
      properties from the session in the `Authorization` header:
       ```
      Authorization: Bearer <token>
      ```
       @method authorize
      @param {object} data
      @param {function} block
    */
    authorize: function authorize() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var block = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      var token = _ember['default'].get(data, this.tokenPropertyName);
      var prefix = this.authorizationPrefix ? this.authorizationPrefix : '';

      if (this.get('session.isAuthenticated') && !_ember['default'].isEmpty(token)) {
        block(this.authorizationHeaderName, prefix + token);
      }
    }
  });
});