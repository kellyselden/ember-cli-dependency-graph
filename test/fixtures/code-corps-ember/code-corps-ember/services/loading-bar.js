define('code-corps-ember/services/loading-bar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var set = Ember.set;
  exports.default = Service.extend({
    isLoading: false,

    start: function start() {
      set(this, 'isLoading', true);
    },
    stop: function stop() {
      set(this, 'isLoading', false);
    }
  });
});