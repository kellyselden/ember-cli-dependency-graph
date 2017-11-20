define('code-corps-ember/initializers/promise', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var RSVP = Ember.RSVP;
  function initialize() {
    window.Promise = RSVP.Promise;
  }

  exports.default = {
    name: 'promise',
    initialize: initialize
  };
});