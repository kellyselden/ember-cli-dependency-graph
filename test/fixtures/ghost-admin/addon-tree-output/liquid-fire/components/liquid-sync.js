define('liquid-fire/components/liquid-sync', ['exports', 'liquid-fire/templates/components/liquid-sync', 'liquid-fire/mixins/pausable'], function (exports, _liquidSync, _pausable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend(_pausable.default, {
    tagName: '',
    layout: _liquidSync.default,
    didInsertElement: function didInsertElement() {
      this.pauseLiquidFire();
    },

    actions: {
      ready: function ready() {
        this.resumeLiquidFire();
      }
    }
  });
});