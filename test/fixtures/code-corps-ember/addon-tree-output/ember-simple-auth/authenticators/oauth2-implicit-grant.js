define('ember-simple-auth/authenticators/oauth2-implicit-grant', ['exports', 'ember-simple-auth/authenticators/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP,
      isEmpty = Ember.isEmpty;
  exports.default = _base.default.extend({
    /**
     Restores the session from a session data object; __will return a resolving
     promise when there is a non-empty `access_token` in the session data__ and
     a rejecting promise otherwise.
      @method restore
     @param {Object} data The data to restore the session from
     @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
     @public
     */
    restore: function restore(data) {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        if (!_this._validateData(data)) {
          return reject('Could not restore session - "access_token" missing.');
        }

        return resolve(data);
      });
    },


    /**
     Authenticates the session using the specified location `hash`
     (see https://tools.ietf.org/html/rfc6749#section-4.2.2).
      __If the access token is valid and thus authentication succeeds, a promise that
     resolves with the access token is returned__, otherwise a promise that rejects
     with the error code as returned by the server is returned
     (see https://tools.ietf.org/html/rfc6749#section-4.2.2.1).
      @method authenticate
     @param {Object} hash The location hash
     @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
     @public
     */
    authenticate: function authenticate(hash) {
      var _this2 = this;

      return new RSVP.Promise(function (resolve, reject) {
        if (hash.error) {
          reject(hash.error);
        } else if (!_this2._validateData(hash)) {
          reject('Invalid auth params - "access_token" missing.');
        } else {
          resolve(hash);
        }
      });
    },


    /**
     This method simply returns a resolving promise.
      @method invalidate
     @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
     @public
     */
    invalidate: function invalidate() {
      return RSVP.Promise.resolve();
    },
    _validateData: function _validateData(data) {
      // see https://tools.ietf.org/html/rfc6749#section-4.2.2

      return !isEmpty(data) && !isEmpty(data.access_token);
    }
  });
});