define('ember-power-datepicker/utils/computed-properties', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fallbackAction = fallbackAction;
  var computed = Ember.computed;
  function fallbackAction(fallback) {
    return computed({
      get: function get() {
        return fallback.bind(this);
      },
      set: function set(_, v) {
        return v === undefined ? fallback.bind(this) : v;
      }
    });
  }
});