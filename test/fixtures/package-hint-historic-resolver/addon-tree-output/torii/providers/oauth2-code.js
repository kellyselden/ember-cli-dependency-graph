define('torii/providers/oauth2-code', ['exports', 'torii/providers/base', 'torii/configuration', 'torii/lib/query-string', 'torii/lib/required-property', 'torii/lib/random-url-safe'], function (exports, _base, _configuration, _queryString, _requiredProperty, _randomUrlSafe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var computed = Ember.computed;

  function currentUrl() {
    var url = [window.location.protocol, "//", window.location.host, window.location.pathname].join('');
    if (url.substr(-1) !== '/') {
      url += '/';
    }
    return url;
  }

  /**
   * Implements authorization against an OAuth2 API
   * using the OAuth2 authorization flow in a popup window.
   *
   * Subclasses should extend this class and define the following properties:
   *   - requiredUrlParams: If there are additional required params
   *   - optionalUrlParams: If there are additional optional params
   *   - name: The name used in the configuration `providers` key
   *   - baseUrl: The base url for OAuth2 code-based flow at the 3rd-party
   *
   *   If there are any additional required or optional url params,
   *   include default values for them (if appropriate).
   *
   * @class Oauth2Provider
   */
  var Oauth2 = _base.default.extend({
    concatenatedProperties: ['requiredUrlParams', 'optionalUrlParams'],

    /**
     * The parameters that must be included as query params in the 3rd-party provider's url that we build.
     * These properties are in the format that should be in the URL (i.e.,
     * usually underscored), but they are looked up as camelCased properties
     * on the instance of this provider. For example, if the 'client_id' is
     * a required url param, when building the URL we look up the value of
     * the 'clientId' (camel-cased) property and put it in the URL as
     * 'client_id=' + this.get('clientId')
     * Subclasses can add additional required url params.
     *
     * @property {array} requiredUrlParams
     */
    requiredUrlParams: ['response_type', 'client_id', 'redirect_uri', 'state'],

    /**
     * Parameters that may be included in the 3rd-party provider's url that we build.
     * Subclasses can add additional optional url params.
     *
     * @property {array} optionalUrlParams
     */
    optionalUrlParams: ['scope'],

    /**
     * The base url for the 3rd-party provider's OAuth2 flow (example: 'https://github.com/login/oauth/authorize')
     *
     * @property {string} baseUrl
     */
    baseUrl: (0, _requiredProperty.default)(),

    /**
     * The apiKey (sometimes called app id) that identifies the registered application at the 3rd-party provider
     *
     * @property {string} apiKey
     */
    apiKey: (0, _configuration.configurable)('apiKey'),

    scope: (0, _configuration.configurable)('scope', null),
    clientId: (0, _configuration.configurable)('clientId', function () {
      return this.get('apiKey');
    }),

    state: (0, _configuration.configurable)('state', function () {
      return this.get('randomState');
    }),

    _randomState: null,
    randomState: computed('_randomState', function () {
      var state = this.get('_randomState');

      if (!state) {
        state = (0, _randomUrlSafe.default)(16);
        this.set('_randomState', state);
      }

      return state;
    }),

    /**
     * The oauth response type we expect from the third party provider. Hardcoded to 'code' for oauth2-code flows
     * @property {string} responseType
     */
    responseType: 'code',

    /**
     * List of parameters that we expect
     * to see in the query params that the 3rd-party provider appends to
     * our `redirectUri` after the user confirms/denies authorization.
     * If any of these parameters are missing, the OAuth attempt is considered
     * to have failed (usually this is due to the user hitting the 'cancel' button)
     *
     * @property {array} responseParams
     */
    responseParams: (0, _requiredProperty.default)(),

    redirectUri: (0, _configuration.configurable)('redirectUri', function () {
      return currentUrl() + 'torii/redirect.html';
    }),

    buildQueryString: function buildQueryString() {
      var requiredParams = this.get('requiredUrlParams'),
          optionalParams = this.get('optionalUrlParams');

      var qs = _queryString.default.create({
        provider: this,
        requiredParams: requiredParams,
        optionalParams: optionalParams
      });
      return qs.toString();
    },

    buildUrl: function buildUrl() {
      var base = this.get('baseUrl'),
          qs = this.buildQueryString();

      return [base, qs].join('?');
    },

    /**
     * @method open
     * @return {Promise<object>} If the authorization attempt is a success,
     * the promise will resolve an object containing the following keys:
     *   - authorizationCode: The `code` from the 3rd-party provider
     *   - provider: The name of the provider (i.e., google-oauth2)
     *   - redirectUri: The redirect uri (some server-side exchange flows require this)
     * If there was an error or the user either canceled the authorization or
     * closed the popup window, the promise rejects.
     */
    open: function open(options) {
      var name = this.get('name'),
          url = this.buildUrl(),
          redirectUri = this.get('redirectUri'),
          responseParams = this.get('responseParams'),
          responseType = this.get('responseType'),
          state = this.get('state'),
          shouldCheckState = responseParams.indexOf('state') !== -1;

      return this.get('popup').open(url, responseParams, options).then(function (authData) {
        var missingResponseParams = [];

        responseParams.forEach(function (param) {
          if (authData[param] === undefined) {
            missingResponseParams.push(param);
          }
        });

        if (missingResponseParams.length) {
          throw new Error("The response from the provider is missing " + "these required response params: " + missingResponseParams.join(', '));
        }

        if (shouldCheckState && authData.state !== state) {
          throw new Error('The response from the provider has an incorrect ' + 'session state param: should be "' + state + '", ' + 'but is "' + authData.state + '"');
        }

        return {
          authorizationCode: decodeURIComponent(authData[responseType]),
          provider: name,
          redirectUri: redirectUri
        };
      });
    }
  });

  exports.default = Oauth2;
});