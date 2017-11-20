define('liquid-fire/promise', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberPromise = Ember.RSVP.Promise;
  exports.default = EmberPromise;
});