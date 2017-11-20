define('ember-power-select/utils/computed-fallback-if-undefined', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = computedFallbackIfUndefined;
  var computed = Ember.computed;
  function computedFallbackIfUndefined(fallback) {
    return computed({
      get: function get() {
        return fallback;
      },
      set: function set(_, v) {
        return v === undefined ? fallback : v;
      }
    });
  }
});