define('ember-power-select/components/power-select/trigger', ['exports', 'ember-power-select/templates/components/power-select/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    layout: _trigger.default,
    tagName: '',

    // Actions
    actions: {
      clear: function clear(e) {
        e.stopPropagation();
        this.get('select').actions.select(null);
        if (e.type === 'touchstart') {
          return false;
        }
      }
    }
  });
});