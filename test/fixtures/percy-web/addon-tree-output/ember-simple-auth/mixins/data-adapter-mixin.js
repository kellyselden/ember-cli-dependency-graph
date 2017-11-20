define('ember-simple-auth/mixins/data-adapter-mixin', ['exports', 'ember'], function (exports, _ember) {
  var service = _ember['default'].inject.service;
  var Mixin = _ember['default'].Mixin;
  var assert = _ember['default'].assert;
  var isPresent = _ember['default'].isPresent;

  /**
    __This mixin can be used to make Ember Data adapters authorize all outgoing
    API requests by injecting a header.__ It works with all authorizers that call
    the authorization callback (see
    {{#crossLink "BaseAuthorizer/authorize:method"}}{{/crossLink}}) with header
    name and header content arguments.
  
    __The `DataAdapterMixin` will also invalidate the session whenever it
    receives a 401 response for an API request.__
  
    ```js
    // app/adapters/application.js
    import DS from 'ember-data';
    import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
  
    export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
      authorizer: 'authorizer:application'
    });
    ```
  
    __The `DataAdapterMixin` requires Ember Data 1.13 or later.__
  
    @class DataAdapterMixin
    @module ember-simple-auth/mixins/data-adapter-mixin
    @extends Ember.Mixin
    @public
  */

  exports['default'] = Mixin.create({
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
       This method applies for Ember Data 2.6 and older. See `headersForRequest`
      for newer versions of Ember Data.
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
       This method will only be called in Ember Data 2.7 or greater. Older versions
      will rely on `ajaxOptions` for request header injection.
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
      @protected
    */
    handleResponse: function handleResponse(status) {
      if (status === 401 && this.get('session.isAuthenticated')) {
        this.get('session').invalidate();
      }
      return this._super.apply(this, arguments);
    }
  });
});