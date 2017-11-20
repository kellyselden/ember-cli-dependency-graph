define('ember-simple-auth/authenticators/base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP,
      Evented = Ember.Evented,
      EmberObject = Ember.Object;
  exports.default = EmberObject.extend(Evented, {
    /**
      __Triggered when the authentication data is updated by the authenticator
      due to an external or scheduled event__. This might happen, e.g., if the
      authenticator refreshes an expired token or an event is triggered from an
      external authentication provider that the authenticator uses. The session
      handles that event, passes the updated data back to the authenticator's
      {{#crossLink "BaseAuthenticator/restore:method"}}{{/crossLink}}
      method and handles the result of that invocation accordingly.
       @event sessionDataUpdated
      @param {Object} data The updated session data
      @public
    */

    /**
      __Triggered when the authentication data is invalidated by the authenticator
      due to an external or scheduled event__. This might happen, e.g., if a token
      expires or an event is triggered from an external authentication provider
      that the authenticator uses. The session handles the event and will
      invalidate itself when it is triggered.
       @event sessionDataInvalidated
      @public
    */

    /**
      Restores the session from a session data object. __This method is invoked
      by the session either on application startup if session data is restored
      from the session store__ or when properties in the store change due to
      external events (e.g. in another tab) and the new session data needs to be
      validated for whether it constitutes an authenticated session.
       __This method returns a promise. A resolving promise results in the session
      becoming or remaining authenticated.__ Any data the promise resolves with
      will be saved in and accessible via the session service's
      `data.authenticated` property (see
      {{#crossLink "SessionService/data:property"}}{{/crossLink}}). A rejecting
      promise indicates that `data` does not constitute a valid session and will
      result in the session being invalidated or remaining unauthenticated.
       The `BaseAuthenticator`'s implementation always returns a rejecting
      promise. __This method must be overridden in subclasses.__
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore() {
      return RSVP.reject();
    },


    /**
      Authenticates the session with the specified `args`. These options vary
      depending on the actual authentication mechanism the authenticator
      implements (e.g. a set of credentials or a Facebook account id etc.). __The
      session will invoke this method in order to authenticate itself__ (see
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}).
       __This method returns a promise. A resolving promise will result in the
      session becoming authenticated.__ Any data the promise resolves with will
      be saved in and accessible via the session service's `data.authenticated`
      property (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).
      A rejecting promise indicates that authentication failed and will result in
      the session remaining unauthenticated.
       The `BaseAuthenticator`'s implementation always returns a rejecting promise
      and thus never authenticates the session. __This method must be overridden
      in subclasses__.
       @method authenticate
      @param {Any} [...args] The arguments that the authenticator requires to authenticate the session
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
      @public
    */
    authenticate: function authenticate() {
      return RSVP.reject();
    },


    /**
      This method is invoked as a callback when the session is invalidated. While
      the session will invalidate itself and clear all authenticated session data,
      it might be necessary for some authenticators to perform additional tasks
      (e.g. invalidating an access token on the server side).
       __This method returns a promise. A resolving promise will result in the
      session becoming unauthenticated.__ A rejecting promise will result in
      invalidation being intercepted and the session remaining authenticated.
       The `BaseAuthenticator`'s implementation always returns a resolving promise
      and thus never intercepts session invalidation. __This method doesn't have
      to be overridden in custom authenticators__ if no actions need to be
      performed on session invalidation.
       @method invalidate
      @param {Object} data The current authenticated session data
      @param {Array} ...args additional arguments as required by the authenticator
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      @public
    */
    invalidate: function invalidate() {
      return RSVP.resolve();
    }
  });
});