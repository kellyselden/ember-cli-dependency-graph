define('ember-simple-auth/authorizers/devise', ['exports', 'ember-simple-auth/authorizers/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = Ember.isEmpty;
  exports.default = _base.default.extend({
    /**
      The token attribute name.
       @property tokenAttributeName
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: 'token',

    /**
      The identification attribute name.
       @property identificationAttributeName
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: 'email',

    /**
      Includes the user's token (see
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
      and identification (see
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
      in the `Authorization` header.
       @method authorize
      @param {Object} data The data that the session currently holds
      @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments.
      @public
    */
    authorize: function authorize(data, block) {
      var _getProperties = this.getProperties('tokenAttributeName', 'identificationAttributeName'),
          tokenAttributeName = _getProperties.tokenAttributeName,
          identificationAttributeName = _getProperties.identificationAttributeName;

      var userToken = data[tokenAttributeName];
      var userIdentification = data[identificationAttributeName];

      if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
        var authData = tokenAttributeName + '="' + userToken + '", ' + identificationAttributeName + '="' + userIdentification + '"';
        block('Authorization', 'Token ' + authData);
      }
    }
  });
});