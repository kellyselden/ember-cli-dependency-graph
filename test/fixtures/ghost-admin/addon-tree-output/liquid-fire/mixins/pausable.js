define('liquid-fire/mixins/pausable', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var defer = Ember.RSVP.defer;
  var on = Ember.on;
  var service = Ember.inject.service;
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    _transitionMap: service('liquid-fire-transitions'),

    _initializeLiquidFirePauseable: on('init', function () {
      this._lfDefer = [];
    }),
    pauseLiquidFire: function pauseLiquidFire() {
      var context = this.nearestWithProperty('_isLiquidChild');
      if (context) {
        var def = new defer();
        var tmap = this.get('_transitionMap');
        tmap.incrementRunningTransitions();
        def.promise.finally(function () {
          return tmap.decrementRunningTransitions();
        });
        this._lfDefer.push(def);
        context._waitForMe(def.promise);
      }
    },

    resumeLiquidFire: on('willDestroyElement', function () {
      var def = this._lfDefer.pop();
      if (def) {
        def.resolve();
      }
    })
  });
});