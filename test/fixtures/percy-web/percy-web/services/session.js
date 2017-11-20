define('percy-web/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var resolve = Ember.RSVP.resolve;
  var EmberPromise = Ember.RSVP.Promise;
  exports.default = _session.default.extend({
    store: service(),
    analytics: service(),

    // set by load method
    currentUser: null,

    loadCurrentUser: function loadCurrentUser() {
      var _this = this;

      if (this.get('isAuthenticated')) {
        return this.get('store').queryRecord('user', {}).then(function (user) {
          _this.set('currentUser', user);
          _this._setupThirdPartyUserContexts(user);
        })
        // This catch will be triggered if the queryRecord or set currentUser
        // fails. If we don't have a user, the site will be very broken
        // so kick them out.
        .catch(function () {
          _this.invalidate();

          _this._clearThirdPartyUserContext();
        });
      } else {
        // This needs to return a resolved promise because beforeModel in
        // ember-simple-auth application route mixin needs a resolved promise.
        return resolve();
      }
    },
    _setupThirdPartyUserContexts: function _setupThirdPartyUserContexts(user) {
      var _this2 = this;

      if (!user) {
        return;
      }
      // Always resolve this successfully, even if it errors.
      // The user should be able to access the site even if third party services fail.
      return new EmberPromise(function (resolve /*reject*/) {
        _this2._setupSentry(user);
        _this2._setupAnalytics(user);
        _this2._setupIntercom(user);
        resolve();
      });
    },
    _clearThirdPartyUserContext: function _clearThirdPartyUserContext() {
      this._clearSentry();
      this._clearAnalytics();

      if (window.localStorage) {
        window.localStorage.clear();
      }
    },
    _setupSentry: function _setupSentry(user) {
      if (window.Raven) {
        Raven.setUserContext({ id: user.get('id') });
      }
    },
    _clearSentry: function _clearSentry() {
      if (window.Raven) {
        Raven.setUserContext();
      }
    },
    _setupAnalytics: function _setupAnalytics(user) {
      this.get('analytics').identifyUser(user);
    },
    _clearAnalytics: function _clearAnalytics() {
      this.get('analytics').invalidate();
    },
    _setupIntercom: function _setupIntercom(user) {
      if (window.Intercom) {
        window.Intercom('update', {
          user_hash: user.get('userHash'),
          name: user.get('name'),
          email: user.get('email'),
          created_at: user.get('createdAt').getTime() / 1000
        });
      }
    }
  });
});