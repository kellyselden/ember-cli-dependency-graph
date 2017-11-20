define('code-corps-ember/components/flash-messages', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['flash'],

    /**
      @property flashMessages
      @type Ember.Service
     */
    flashMessages: service()
  });
});