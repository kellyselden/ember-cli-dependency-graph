define('travis/components/org-item', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('account.type'), _dec2 = (0, _computed.alias)('account.selected'), _dec3 = (0, _object.computed)('account.{name,login}'), _dec4 = (0, _object.computed)('account.avatarUrl'), _dec5 = (0, _object.computed)('account.type'), (_obj = {
    classNames: ['media', 'account'],
    tagName: 'li',
    classNameBindings: ['type', 'selected'],

    tokenIsVisible: false,

    type: null,
    selected: null,

    name: function name(_name, login) {
      return _name || login;
    },
    avatarUrl: function avatarUrl(url) {
      return url || false;
    },
    isUser: function isUser(type) {
      return type === 'user';
    },


    actions: {
      tokenVisibility: function tokenVisibility() {
        this.toggleProperty('tokenIsVisible');
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'type', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'type'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'selected', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'selected'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'name', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'name'), _obj), _applyDecoratedDescriptor(_obj, 'avatarUrl', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'avatarUrl'), _obj), _applyDecoratedDescriptor(_obj, 'isUser', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'isUser'), _obj)), _obj)));
});