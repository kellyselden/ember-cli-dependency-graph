define('torii/providers/oauth2-bearer', ['exports', 'torii/providers/oauth2-code'], function (exports, _oauth2Code) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Oauth2Bearer = _oauth2Code.default.extend({
    responseType: 'token',

    /**
     * @method open
     * @return {Promise<object>} If the authorization attempt is a success,
     * the promise will resolve an object containing the following keys:
     *   - authorizationToken: The `token` from the 3rd-party provider
     *   - provider: The name of the provider (i.e., google-oauth2)
     *   - redirectUri: The redirect uri (some server-side exchange flows require this)
     * If there was an error or the user either canceled the authorization or
     * closed the popup window, the promise rejects.
     */
    open: function open(options) {
      var name = this.get('name'),
          url = this.buildUrl(),
          redirectUri = this.get('redirectUri'),
          responseParams = this.get('responseParams');

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

        return {
          authorizationToken: authData,
          provider: name,
          redirectUri: redirectUri
        };
      });
    }
  });

  exports.default = Oauth2Bearer;
});