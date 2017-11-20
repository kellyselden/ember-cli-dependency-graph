define('package-hint-historic-resolver/torii-providers/github', ['exports', 'torii/providers/github-oauth2'], function (exports, _githubOauth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var get = Ember.get;
  exports.default = _githubOauth.default.extend({
    adapter: service(),

    fetch: function fetch(data) {
      return data;
    },
    open: function open() {
      var _this = this;

      return this._super.apply(this, arguments).then(function (authorization) {
        var authorizationCode = authorization.authorizationCode;

        var url = 'github/auth?code=' + authorizationCode;

        return get(_this, 'adapter').ajax(url, 'POST').then(function (response) {
          authorization.accessToken = response['access_token'];

          return authorization;
        });
      });
    }
  });
});