define('ember-power-calendar/utils/computed-fallback-if-undefined', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (fallback) {
    return computed({
      get: function get() {
        return fallback;
      },
      set: function set(_, v) {
        return v === undefined ? fallback : v;
      }
    });
  };

  var computed = Ember.computed;
});