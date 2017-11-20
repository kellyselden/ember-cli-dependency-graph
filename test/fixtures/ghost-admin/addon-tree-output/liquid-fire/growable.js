define('liquid-fire/growable', ['exports', 'liquid-fire/promise', 'velocity'], function (exports, _promise, _velocity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Mixin = Ember.Mixin;
  var capitalize = Ember.String.capitalize;
  exports.default = Mixin.create({
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: 'slide',
    shrinkDelay: 0,
    growDelay: 0,
    growWidth: true,
    growHeight: true,

    transitionMap: service('liquid-fire-transitions'),

    animateGrowth: function animateGrowth(elt, have, want) {
      var _this = this;

      this.get('transitionMap').incrementRunningTransitions();
      var adaptations = [];

      if (this.get('growWidth')) {
        adaptations.push(this._adaptDimension(elt, 'width', have, want));
      }

      if (this.get('growHeight')) {
        adaptations.push(this._adaptDimension(elt, 'height', have, want));
      }

      return _promise.default.all(adaptations).then(function () {
        _this.get('transitionMap').decrementRunningTransitions();
      });
    },

    _adaptDimension: function _adaptDimension(elt, dimension, have, want) {
      if (have[dimension] === want[dimension]) {
        return _promise.default.resolve();
      }
      var target = {};
      target['outer' + capitalize(dimension)] = [want[dimension], have[dimension]];
      return (0, _velocity.default)(elt[0], target, {
        delay: this._delayFor(have[dimension], want[dimension]),
        duration: this._durationFor(have[dimension], want[dimension]),
        queue: false,
        easing: this.get('growEasing') || this.constructor.prototype.growEasing
      });
    },

    _delayFor: function _delayFor(before, after) {
      if (before > after) {
        return this.get('shrinkDelay') || this.constructor.prototype.shrinkDelay;
      }

      return this.get('growDelay') || this.constructor.prototype.growDelay;
    },

    _durationFor: function _durationFor(before, after) {
      return Math.min(this.get('growDuration') || this.constructor.prototype.growDuration, 1000 * Math.abs(before - after) / (this.get('growPixelsPerSecond') || this.constructor.prototype.growPixelsPerSecond));
    }

  });
});