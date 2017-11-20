define('code-corps-ember/components/error-formatter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['error-formatter'],

    /**
      The default error message if the error has no other messages
       @property defaultMessage
      @type String
     */
    defaultMessage: 'An unexpected error has occured',

    /**
      The messages that are returned by the error thrown.
       @property messages
      @type String
     */
    messages: computed('error', function () {
      var error = get(this, 'error');
      var handler = this._findHandler(error);
      if (handler) {
        return handler(error);
      } else {
        console.error(error);
      }
    }),

    /**
     * Determines the type of error from an error response and returns
     * the correct messsage formatter function for it.
     *
     * @param  {Object} errorResponse The error response received from the server
     * @return {Function}             Function which takes the error response and returns a list of messages
     */
    _findHandler: function _findHandler(errorResponse) {
      if (get(errorResponse, 'isFriendlyError')) {
        return this._friendlyErrorMessages;
      } else if (get(errorResponse, 'isAdapterError')) {
        return this._adapterErrorMessages;
      } else if (get(errorResponse, 'error.type') === 'card_error') {
        return this._stripeCardErrorMessages;
      }
    },
    _friendlyErrorMessages: function _friendlyErrorMessages(errorResponse) {
      return [get(errorResponse, 'message')];
    },


    /**
     * Formats messages for an adapter error response.
     * An adapter error response contains an array of errors with a
     * `title` and a `detail` property, but in most cases, that array only contains
     * one error.
     * @param  {Object} errorResponse Response received from the server
     * @return {Array}                Array of message strings
     */
    _adapterErrorMessages: function _adapterErrorMessages(errorResponse) {
      return get(errorResponse, 'errors').map(function (e) {
        return e.title + ': ' + e.detail;
      });
    },


    /**
     * Formats messages for a stripe card error response.
     *
     * The response contains an `error` object, for which the relevant key is
     * the `message` property.
     * @param  {Object} errorResponse Error response received from the stripe service
     * @return {Array}                An array of string messages, containing single string
     */
    _stripeCardErrorMessages: function _stripeCardErrorMessages(errorResponse) {
      return [get(errorResponse, 'error.message')];
    }
  });
});