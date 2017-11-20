define('travis/mixins/duration-calculations', ['exports', 'travis/utils/duration-from', 'ember-decorators/object'], function (exports, _durationFrom, _object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _desc, _value, _obj;

  var Mixin = Ember.Mixin;
  exports.default = Mixin.create((_dec = (0, _object.computed)('_duration', 'finishedAt', 'startedAt', 'notStarted'), (_obj = {
    duration: function duration(_duration, finishedAt, startedAt, notStarted) {
      if (notStarted) {
        return null;
      } else if (_duration) {
        return _duration;
      } else {
        return (0, _durationFrom.default)(startedAt, finishedAt);
      }
    },
    updateTimes: function updateTimes() {
      this.notifyPropertyChange('duration');
      return this.notifyPropertyChange('finishedAt');
    }
  }, (_applyDecoratedDescriptor(_obj, 'duration', [_dec], Object.getOwnPropertyDescriptor(_obj, 'duration'), _obj)), _obj)));
});