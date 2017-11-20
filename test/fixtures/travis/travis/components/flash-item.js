define('travis/components/flash-item', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service'], function (exports, _object, _computed, _service) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('flash.type'), _dec2 = (0, _computed.alias)('flashes.topBarVisible'), (_obj = {
    tagName: 'li',
    classNameBindings: ['type', 'topBarVisible:below-top-bar:fixed'],

    flashes: null,

    type: function type(_type) {
      return _type || 'broadcast';
    },
    topBarVisible: null,

    actions: {
      close: function close() {
        return this.attrs.close(this.get('flash'));
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'type', [_dec], Object.getOwnPropertyDescriptor(_obj, 'type'), _obj), _applyDecoratedDescriptor(_obj, 'topBarVisible', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'topBarVisible'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj)));
});