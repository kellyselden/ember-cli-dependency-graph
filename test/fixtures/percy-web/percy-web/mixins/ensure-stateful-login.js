define('percy-web/mixins/ensure-stateful-login', ['exports', 'percy-web/lib/lock-settings'], function (exports, _lockSettings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var $ = Ember.$;


  // This mixin should be used when accessing the lock.js authentication modal.
  // This mixin fires a request to our backend's `/api/auth/session` endoint and
  // gets back an object with a state token (`{state: 'foo'}`).
  // We wait for this token to get back, set it in the lock options, and
  // only then have the lock modal show up.
  // This should protect against CSRF attacks.
  var EnsureStatefulLogin = Mixin.create({
    showLoginModalEnsuringState: function showLoginModalEnsuringState() {
      var _this = this;

      return this._getStateToken().then(function (stateToken) {
        _lockSettings.default.auth.params.state = stateToken.state;
        return _this.get('session').authenticate('authenticator:auth0-lock', _lockSettings.default);
      });
    },
    _getStateToken: function _getStateToken() {
      return $.ajax({
        type: 'GET',
        url: '/api/auth/session'
      });
    }
  });

  exports.default = EnsureStatefulLogin;
});