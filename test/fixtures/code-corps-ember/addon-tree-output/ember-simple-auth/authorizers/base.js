define('ember-simple-auth/authorizers/base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = Ember.Object;
  exports.default = EmberObject.extend({
    /**
      Authorizes a block of code. This method will be invoked by the session
      service's {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}
      method which will pass the current authenticated session data (see
      {{#crossLink "SessionService/data:property"}}{{/crossLink}}) and a block.
      Depending on the mechanism it implements, the authorizer transforms the
      session data into authorization data and invokes the block with that data.
       `BaseAuthorizer`'s implementation does nothing. __This method must be
      overridden in custom authorizers.__
       @method authorize
      @param {Object} data The current authenticated session data
      @param {Function} block The callback to call with the authorization data
      @public
    */
    authorize: function authorize() {}
  });
});