define('ember-simple-auth/authenticators/test', ['exports', 'ember-simple-auth/authenticators/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP;
  exports.default = _base.default.extend({
    restore: function restore(data) {
      return RSVP.resolve(data);
    },
    authenticate: function authenticate(data) {
      return RSVP.resolve(data);
    },
    invalidate: function invalidate() {
      return RSVP.resolve();
    }
  });
});