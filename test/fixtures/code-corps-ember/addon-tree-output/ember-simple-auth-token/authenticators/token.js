define('ember-simple-auth-token/authenticators/token', ['exports', 'ember', 'ember-simple-auth/authenticators/base', 'ember-simple-auth-token/configuration'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase, _emberSimpleAuthTokenConfiguration) {
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
    Authenticator that works with token-based authentication like JWT.
  
    _The factory for this authenticator is registered as
    `'authenticator:token'` in Ember's container._
  
    @class Token
    @namespace SimpleAuth.Authenticators
    @module ember-simple-auth-token/authenticators/token
    @extends Base
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    /**
      The endpoint on the server the authenticator acquires the auth token from.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#serverTokenEndpoint`](#SimpleAuth-Configuration-Token-serverTokenEndpoint).
       @property serverTokenEndpoint
      @type String
      @default '/api/token-auth/'
    */
    serverTokenEndpoint: '/api/token-auth/',

    /**
      The attribute-name that is used for the identification field when sending the
      authentication data to the server.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#identificationField`](#SimpleAuth-Configuration-Token-identificationField).
       @property identificationField
      @type String
      @default 'username'
    */
    identificationField: 'username',

    /**
      The attribute-name that is used for the password field when sending the
      authentication data to the server.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#passwordfield`](#SimpleAuth-Configuration-Token-passwordfield).
       @property passwordField
      @type String
      @default 'password'
    */
    passwordField: 'password',

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
      The property that stores custom headers that will be sent on every request.
       This value can be configured via
      [`SimpleAuth.Configuration.Token#headers`](#SimpleAuth-Configuration-Token-headers).
       @property headers
      @type Object
      @default {}
    */
    headers: {},

    /**
      @method init
      @private
    */
    init: function init() {
      this.serverTokenEndpoint = _emberSimpleAuthTokenConfiguration['default'].serverTokenEndpoint;
      this.identificationField = _emberSimpleAuthTokenConfiguration['default'].identificationField;
      this.passwordField = _emberSimpleAuthTokenConfiguration['default'].passwordField;
      this.tokenPropertyName = _emberSimpleAuthTokenConfiguration['default'].tokenPropertyName;
      this.headers = _emberSimpleAuthTokenConfiguration['default'].headers;
    },

    /**
      Restores the session from a set of session properties; __will return a
      resolving promise when there's a non-empty `token` in the
      `properties`__ and a rejecting promise otherwise.
       @method restore
      @param {Object} properties The properties to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
    */
    restore: function restore(properties) {
      var _this = this;

      var propertiesObject = _ember['default'].Object.create(properties);

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        if (!_ember['default'].isEmpty(propertiesObject.get(_this.tokenPropertyName))) {
          resolve(properties);
        } else {
          reject();
        }
      });
    },

    /**
      Authenticates the session with the specified `credentials`; the credentials
      are `POST`ed to the
      [`Authenticators.Token#serverTokenEndpoint`](#SimpleAuth-Authenticators-Token-serverTokenEndpoint)
      and if they are valid the server returns an auth token in
      response. __If the credentials are valid and authentication succeeds, a
      promise that resolves with the server's response is returned__, otherwise a
      promise that rejects with the server error is returned.
       @method authenticate
      @param {Object} credentials The credentials to authenticate the session with
      @param {Object} headers Additional headers to pass with request
      @return {Ember.RSVP.Promise} A promise that resolves when an auth token is successfully acquired from the server and rejects otherwise
    */
    authenticate: function authenticate(credentials, headers) {
      var _this2 = this;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        var data = _this2.getAuthenticateData(credentials);

        _this2.makeRequest(data, headers).then(function (response) {
          _ember['default'].run(function () {
            resolve(_this2.getResponseData(response));
          });
        }, function (xhr) {
          _ember['default'].run(function () {
            reject(xhr.responseJSON || xhr.responseText);
          });
        });
      });
    },

    /**
      Returns an object used to be sent for authentication.
       @method getAuthenticateData
      @return {object} An object with properties for authentication.
    */
    getAuthenticateData: function getAuthenticateData(credentials) {
      var _authentication;

      var authentication = (_authentication = {}, _defineProperty(_authentication, this.passwordField, credentials.password), _defineProperty(_authentication, this.identificationField, credentials.identification), _authentication);

      return authentication;
    },

    /**
      Returns an object with properties the `authenticate` promise will resolve,
      be saved in and accessible via the session.
       @method getResponseData
      @return {object} An object with properties for the session.
    */
    getResponseData: function getResponseData(response) {
      return response;
    },

    /**
      Does nothing
       @method invalidate
      @return {Ember.RSVP.Promise} A resolving promise
    */
    invalidate: function invalidate() {
      return _ember['default'].RSVP.resolve();
    },

    /**
      @method makeRequest
      @param {Object} data Object that will be sent to server
      @param {Object} headers Additional headers that will be sent to server
      @private
    */
    makeRequest: function makeRequest(data, headers) {
      var _this3 = this;

      return _ember['default'].$.ajax({
        url: this.serverTokenEndpoint,
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        headers: this.headers,
        beforeSend: function beforeSend(xhr, settings) {
          if (_this3.headers['Accept'] === null || _this3.headers['Accept'] === undefined) {
            xhr.setRequestHeader('Accept', settings.accepts.json);
          }

          if (headers) {
            Object.keys(headers).forEach(function (key) {
              xhr.setRequestHeader(key, headers[key]);
            });
          }
        }
      });
    }
  });
});