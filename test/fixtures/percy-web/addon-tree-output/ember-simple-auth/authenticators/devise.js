define('ember-simple-auth/authenticators/devise', ['exports', 'ember', 'ember-simple-auth/authenticators/base', 'ember-network/fetch'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase, _emberNetworkFetch) {
  var Promise = _ember['default'].RSVP.Promise;
  var isEmpty = _ember['default'].isEmpty;
  var run = _ember['default'].run;
  var emberAssign = _ember['default'].assign;
  var merge = _ember['default'].merge;
  var computed = _ember['default'].computed;

  var assign = emberAssign || merge;

  var JSON_CONTENT_TYPE = 'application/json';

  /**
    Authenticator that works with the Ruby gem
    [devise](https://github.com/plataformatec/devise).
  
    __As token authentication is not actually part of devise anymore, the server
    needs to implement some customizations__ to work with this authenticator -
    see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).
  
    @class DeviseAuthenticator
    @module ember-simple-auth/authenticators/devise
    @extends BaseAuthenticator
    @public
  */
  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({
    /**
      The endpoint on the server that the authentication request is sent to.
       @property serverTokenEndpoint
      @type String
      @default '/users/sign_in'
      @public
    */
    serverTokenEndpoint: '/users/sign_in',

    /**
      The devise resource name. __This will be used in the request and also be
      expected in the server's response.__
       @property resourceName
      @type String
      @default 'user'
      @public
    */
    resourceName: 'user',

    /**
      The token attribute name. __This will be used in the request and also be
      expected in the server's response.__
       @property tokenAttributeName
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: 'token',

    /**
      The identification attribute name. __This will be used in the request and
      also be expected in the server's response.__
       @property identificationAttributeName
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: 'email',

    /**
      When authentication fails, the rejection callback is provided with the whole
      Fetch API [Response](https://fetch.spec.whatwg.org/#response-class) object
      instead of its responseJSON or responseText.
       This is useful for cases when the backend provides additional context not
      available in the response body.
       @property rejectWithXhr
      @type Boolean
      @default false
      @deprecated DeviseAuthenticator/rejectWithResponse:property
      @public
    */
    rejectWithXhr: computed.deprecatingAlias('rejectWithResponse', {
      id: 'ember-simple-auth.authenticator.reject-with-xhr',
      until: '2.0.0'
    }),

    /**
      When authentication fails, the rejection callback is provided with the whole
      Fetch API [Response](https://fetch.spec.whatwg.org/#response-class) object
      instead of its responseJSON or responseText.
       This is useful for cases when the backend provides additional context not
      available in the response body.
       @property rejectWithResponse
      @type Boolean
      @default false
      @public
    */
    rejectWithResponse: false,

    /**
      Restores the session from a session data object; __returns a resolving
      promise when there are non-empty
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
      values in `data`__ and a rejecting promise otherwise.
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return this._validate(data) ? Promise.resolve(data) : Promise.reject();
    },

    /**
      Authenticates the session with the specified `identification` and
      `password`; the credentials are `POST`ed to the
      {{#crossLink "DeviseAuthenticator/serverTokenEndpoint:property"}}server{{/crossLink}}.
      If the credentials are valid the server will responds with a
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}.
      __If the credentials are valid and authentication succeeds, a promise that
      resolves with the server's response is returned__, otherwise a promise that
      rejects with the server error is returned.
       @method authenticate
      @param {String} identification The user's identification
      @param {String} password The user's password
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate(identification, password) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var useResponse = _this.get('rejectWithResponse');

        var _getProperties = _this.getProperties('resourceName', 'identificationAttributeName', 'tokenAttributeName');

        var resourceName = _getProperties.resourceName;
        var identificationAttributeName = _getProperties.identificationAttributeName;
        var tokenAttributeName = _getProperties.tokenAttributeName;

        var data = {};
        data[resourceName] = { password: password };
        data[resourceName][identificationAttributeName] = identification;

        _this.makeRequest(data).then(function (response) {
          if (response.ok) {
            response.json().then(function (json) {
              if (_this._validate(json)) {
                var _resourceName = _this.get('resourceName');
                var _json = json[_resourceName] ? json[_resourceName] : json;
                run(null, resolve, _json);
              } else {
                run(null, reject, 'Check that server response includes ' + tokenAttributeName + ' and ' + identificationAttributeName);
              }
            });
          } else {
            if (useResponse) {
              run(null, reject, response);
            } else {
              response.json().then(function (json) {
                return run(null, reject, json);
              });
            }
          }
        })['catch'](function (error) {
          return run(null, reject, error);
        });
      });
    },

    /**
      Does nothing
       @method invalidate
      @return {Ember.RSVP.Promise} A resolving promise
      @public
    */
    invalidate: function invalidate() {
      return Promise.resolve();
    },

    /**
      Makes a request to the Devise server using
      [ember-network/fetch](https://github.com/tomdale/ember-network#fetch).
       @method makeRequest
      @param {Object} data The request data
      @param {Object} options request options that are passed to `fetch`
      @return {Promise} The promise returned by `fetch`
      @protected
    */
    makeRequest: function makeRequest(data) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = options.url || this.get('serverTokenEndpoint');
      var requestOptions = {};
      var body = JSON.stringify(data);
      assign(requestOptions, {
        body: body,
        method: 'POST',
        headers: {
          'accept': JSON_CONTENT_TYPE,
          'content-type': JSON_CONTENT_TYPE
        }
      });
      assign(requestOptions, options || {});

      return (0, _emberNetworkFetch['default'])(url, requestOptions);
    },

    _validate: function _validate(data) {
      var tokenAttributeName = this.get('tokenAttributeName');
      var identificationAttributeName = this.get('identificationAttributeName');
      var resourceName = this.get('resourceName');
      var _data = data[resourceName] ? data[resourceName] : data;

      return !isEmpty(_data[tokenAttributeName]) && !isEmpty(_data[identificationAttributeName]);
    }
  });
});