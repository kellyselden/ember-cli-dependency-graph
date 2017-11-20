define('travis/components/repository-switch', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('repository.active'), (_obj = {
    tagName: 'button',
    classNames: ['switch'],
    classNameBindings: ['repository.active:active', 'disabled:disabled', 'disabled:inline-block'],
    attributeBindings: ['aria-checked', 'role'],

    role: 'switch',

    'aria-checked': function ariaChecked(active) {
      return !!active;
    },
    click: function click() {
      if (!this.get('disabled')) {
        this.get('toggleRepositoryTask').perform();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'aria-checked', [_dec], Object.getOwnPropertyDescriptor(_obj, 'aria-checked'), _obj)), _obj)));
});