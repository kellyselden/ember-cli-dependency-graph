define('code-corps-ember/components/error-wrapper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var observer = Ember.observer;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['error-wrapper', 'center-pseudo'],

    background: service(),

    /**
      Returns a message based on the type of error thrown.
       @property errorClass
      @type String
    */
    errorClass: computed('is404', function () {
      if (this.get('is404')) {
        return 'warning';
      } else if (this.get('is503')) {
        return 'warning';
      } else {
        return 'danger';
      }
    }),

    /**
      An array of HTTP Status Codes passed by the thrown error.
       @property httpStatusCodes
      @type Array
    */
    // Map the HTTP status codes into an array or
    // an empty array if there are no such status codes
    httpStatusCodes: computed('error', function () {
      var error = this.get('error');
      if (error && error.hasOwnProperty('errors')) {
        var errors = error.errors;

        return errors.map(function (err) {
          return parseInt(err.status);
        });
      } else {
        return [];
      }
    }),

    /**
      Determines if an error is a 404 status or not.
       @property is404
      @type Boolean
    */
    is404: computed('httpStatusCodes', function () {
      return this.get('httpStatusCodes').includes(404);
    }),

    /**
      Determines if an error is a 503 status or not.
       @property is503
      @type Boolean
    */
    is503: computed('httpStatusCodes', function () {
      console.log(this.get('httpStatusCodes'));
      return this.get('httpStatusCodes').includes(503);
    }),

    /**
      Updates the background based on the error class.
       @method observeErrorClass
    */
    observeErrorClass: observer('errorClass', function () {
      this.updateBackground();
    }),

    /**
      Updates the background on render.
       @method didRender
    */
    didRender: function didRender() {
      this.updateBackground();
    },


    /**
      Resets the background.
       @method willDestroyElement
    */
    willDestroyElement: function willDestroyElement() {
      this.get('background').reset();
    },


    /**
      Updates the background based on the error thrown.
       @method updateBackground
    */
    updateBackground: function updateBackground() {
      this.set('background.class', this.get('errorClass'));
      this.get('background').updateBackgroundClass();
    }
  });
});