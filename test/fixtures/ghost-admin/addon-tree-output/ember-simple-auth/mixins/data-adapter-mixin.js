define('ember-simple-auth/mixins/data-adapter-mixin', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service,
      Mixin = Ember.Mixin,
      assert = Ember.assert,
      isPresent = Ember.isPresent;
  exports.default = Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),

    /**
      The authorizer that is used to authorize API requests. The authorizer has
      to call the authorization callback (see
      {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
      name and header content arguments. __This property must be overridden in
      adapters using this mixin.__
       @property authorizer
      @type String
      @default null
      @public
    */
    authorizer: null,

    /**
      Defines a `beforeSend` hook (see http://api.jquery.com/jQuery.ajax/) that
      injects a request header containing the authorization data as constructed
      by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}
      (see
      {{#crossLink "SessionService/authorize:method"}}{{/crossLink}}). The
      specific header name and contents depend on the actual authorizer that is
      used.
       Until [emberjs/rfcs#171](https://github.com/emberjs/rfcs/pull/171)
      gets resolved and [ds-improved-ajax](https://github.com/emberjs/data/pull/3099)
      [feature flag](https://github.com/emberjs/data/blob/master/FEATURES.md#feature-flags)
      is enabled, this method will be called for **every** ember-data version.
      `headersForRequest` *should* replace it after the resolution of the RFC.
       @method ajaxOptions
      @protected
    */
    ajaxOptions: function ajaxOptions() {
      var _this = this;

      var authorizer = this.get('authorizer');
      assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", isPresent(authorizer));

      var hash = this._super.apply(this, arguments);
      var beforeSend = hash.beforeSend;


      hash.beforeSend = function (xhr) {
        _this.get('session').authorize(authorizer, function (headerName, headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        });
        if (beforeSend) {
          beforeSend(xhr);
        }
      };
      return hash;
    },


    /**
      Adds request headers containing the authorization data as constructed
      by the {{#crossLink "DataAdapterMixin/authorizer:property"}}{{/crossLink}}.
       Until [emberjs/rfcs#171](https://github.com/emberjs/rfcs/pull/171)
      gets resolved and [ds-improved-ajax](https://github.com/emberjs/data/pull/3099)
      [feature flag](https://github.com/emberjs/data/blob/master/FEATURES.md#feature-flags)
      is enabled, this method will **not** be used.
      See `ajaxOptions` instead.
       @method headersForRequest
      @protected
     */
    headersForRequest: function headersForRequest() {
      var authorizer = this.get('authorizer');
      assert("You're using the DataAdapterMixin without specifying an authorizer. Please add `authorizer: 'authorizer:application'` to your adapter.", isPresent(authorizer));

      var headers = this._super.apply(this, arguments);
      headers = Object(headers);
      this.get('session').authorize(authorizer, function (headerName, headerValue) {
        headers[headerName] = headerValue;
      });
      return headers;
    },


    /**
      This method is called for every response that the adapter receives from the
      API. If the response has a 401 status code it invalidates the session (see
      {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).
       @method handleResponse
      @param {Number} status The response status as received from the API
      @param  {Object} headers HTTP headers as received from the API
      @param {Any} payload The response body as received from the API
      @param {Object} requestData the original request information
      @protected
    */
    handleResponse: function handleResponse(status, headers, payload, requestData) {
      this.ensureResponseAuthorized(status, headers, payload, requestData);
      return this._super.apply(this, arguments);
    },


    /**
     The default implementation for handleResponse.
     If the response has a 401 status code it invalidates the session (see
      {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).
      Override this method if you want custom invalidation logic for incoming responses.
     @method ensureResponseAuthorized
     @param {Number} status The response status as received from the API
     @param  {Object} headers HTTP headers as received from the API
     @param {Any} payload The response body as received from the API
     @param {Object} requestData the original request information
    */
    ensureResponseAuthorized: function ensureResponseAuthorized(status /* ,headers, payload, requestData */) {
      if (status === 401 && this.get('session.isAuthenticated')) {
        this.get('session').invalidate();
      }
    }
  });
});