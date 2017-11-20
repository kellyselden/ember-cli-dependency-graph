define('travis/mixins/duration-attributes', ['exports', 'ember-data/attr', 'ember-decorators/object'], function (exports, _attr, _object) {
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

  var _dec, _dec2, _desc, _value, _obj;

  var Mixin = Ember.Mixin;
  exports.default = Mixin.create((_dec = (0, _object.computed)('_startedAt', 'notStarted'), _dec2 = (0, _object.computed)('_finishedAt', 'notStarted'), (_obj = {
    _startedAt: (0, _attr.default)(),
    _finishedAt: (0, _attr.default)(),

    startedAt: function startedAt(_startedAt, notStarted) {
      if (!notStarted) {
        return _startedAt;
      }
    },
    finishedAt: function finishedAt(_finishedAt, notStarted) {
      if (!notStarted) {
        return _finishedAt;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'startedAt', [_dec], Object.getOwnPropertyDescriptor(_obj, 'startedAt'), _obj), _applyDecoratedDescriptor(_obj, 'finishedAt', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'finishedAt'), _obj)), _obj)));
});