define('travis/components/travis-switch', ['exports', 'ember-decorators/object/computed'], function (exports, _computed) {
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

  var _dec, _desc, _value, _obj, _init;

  var next = Ember.run.next;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.or)('target.active', 'active'), (_obj = {
    tagName: 'button',
    classNames: ['travis-switch', 'switch'],
    classNameBindings: ['_active:active'],

    attributeBindings: ['type'],
    type: 'button',

    _active: null,

    click: function click() {
      var target = this.get('target');
      if (this.get('toggleAutomatically') !== 'false') {
        if (target) {
          this.set('target.active', !this.get('target.active'));
        } else {
          this.set('active', !this.get('active'));
        }
      }
      return next(this, function () {
        return this.sendAction('action', target);
      });
    }
  }, (_applyDecoratedDescriptor(_obj, '_active', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, '_active'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj)));
});