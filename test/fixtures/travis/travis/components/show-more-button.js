define('travis/components/show-more-button', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('isLoading'), _dec2 = (0, _object.computed)('isLoading'), (_obj = {
    tagName: 'button',
    classNames: ['showmore-button', 'button'],
    classNameBindings: ['isLoading'],
    attributeBindings: ['disabled'],

    disabled: null,

    buttonLabel: function buttonLabel(loading) {
      if (loading) {
        return 'Loading';
      }
      return 'Show more';
    },
    click: function click() {
      return this.attrs.showMore();
    }
  }, (_applyDecoratedDescriptor(_obj, 'disabled', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'disabled'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'buttonLabel', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'buttonLabel'), _obj)), _obj)));
});