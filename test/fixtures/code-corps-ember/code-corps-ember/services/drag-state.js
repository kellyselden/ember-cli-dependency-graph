define('code-corps-ember/services/drag-state', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    isDragging: false,

    dragging: function dragging() {
      this.set('isDragging', true);
    },
    leaving: function leaving() {
      this.set('isDragging', false);
    }
  });
});