define('torii/providers/oauth1', ['exports', 'torii/providers/base', 'torii/configuration'], function (exports, _base, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /*
   * This class implements authentication against an API
   * using the OAuth1.0a request token flow in a popup window.
   */

  var Oauth1 = _base.default.extend({
    name: 'oauth1',

    requestTokenUri: (0, _configuration.configurable)('requestTokenUri'),

    buildRequestTokenUrl: function buildRequestTokenUrl() {
      return this.get('requestTokenUri');
    },

    open: function open(options) {
      var name = this.get('name'),
          url = this.buildRequestTokenUrl();

      return this.get('popup').open(url, ['code'], options).then(function (authData) {
        authData.provider = name;
        return authData;
      });
    }
  });

  exports.default = Oauth1;
});