define('ember-awesome-macros/promise/resolve', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP;
  var resolve = RSVP.resolve;
  exports.default = (0, _curriedComputed.default)(resolve);
});