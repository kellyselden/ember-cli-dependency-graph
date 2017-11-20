define('percy-web/services/admin-mode', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    // We're using get and set here instead of a computed property
    // so the value returned always matches what's in local storage
    // even if the value in local storage is updated on another tab etc.
    get: function get() {
      return window.localStorage && window.localStorage.getItem('percyMode');
    },
    set: function set(mode) {
      window.localStorage.setItem('percyMode', mode);
    },
    clear: function clear() {
      window.localStorage.removeItem('percyMode');
    },


    // If the user has any mode set, exclude them from Analytics
    excludeFromAnalytics: function excludeFromAnalytics() {
      return !!this.get();
    }
  });
});