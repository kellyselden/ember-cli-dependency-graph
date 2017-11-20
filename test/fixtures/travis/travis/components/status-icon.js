define('travis/components/status-icon', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _obj, _init, _init2, _init3;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('status'), _dec2 = (0, _object.computed)('status'), _dec3 = (0, _object.computed)('status'), _dec4 = (0, _computed.equal)('status', 'errored'), _dec5 = (0, _computed.equal)('status', 'canceled'), _dec6 = (0, _object.computed)('status'), _dec7 = (0, _computed.empty)('status'), (_obj = {
    tagName: 'span',
    classNames: ['status-icon', 'icon'],
    classNameBindings: ['status'],
    attributeBindings: ['label:aria-label', 'label:title'],

    label: function label(status) {
      return 'Job ' + status;
    },
    hasPassed: function hasPassed(status) {
      return ['passed', 'approved'].includes(status);
    },
    hasFailed: function hasFailed(status) {
      return ['failed', 'rejected'].includes(status);
    },
    hasErrored: null,

    wasCanceled: null,

    isRunning: function isRunning(status) {
      var runningStates = ['started', 'queued', 'booting', 'received', 'created', 'pending'];
      return runningStates.includes(status);
    },
    isEmpty: null
  }, (_applyDecoratedDescriptor(_obj, 'label', [_dec], Object.getOwnPropertyDescriptor(_obj, 'label'), _obj), _applyDecoratedDescriptor(_obj, 'hasPassed', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'hasPassed'), _obj), _applyDecoratedDescriptor(_obj, 'hasFailed', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'hasFailed'), _obj), _applyDecoratedDescriptor(_obj, 'hasErrored', [_dec4], (_init = Object.getOwnPropertyDescriptor(_obj, 'hasErrored'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'wasCanceled', [_dec5], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'wasCanceled'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isRunning', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'isRunning'), _obj), _applyDecoratedDescriptor(_obj, 'isEmpty', [_dec7], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'isEmpty'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj)), _obj)));
});