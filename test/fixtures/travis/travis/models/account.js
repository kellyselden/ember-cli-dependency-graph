define('travis/models/account', ['exports', 'ember-data/attr', 'ember-data/model', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _attr, _model, _object, _computed) {
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

  var isBlank = Ember.isBlank;
  exports.default = _model.default.extend((_dec = (0, _computed.alias)('id'), _dec2 = (0, _object.computed)('login', 'name'), (_obj = {
    name: (0, _attr.default)(),
    type: (0, _attr.default)(),
    avatarUrl: (0, _attr.default)(),
    reposCount: (0, _attr.default)('number'),
    subscribed: (0, _attr.default)('boolean'),
    education: (0, _attr.default)('boolean'),

    login: null,

    displayName: function displayName(login, name) {
      if (isBlank(name)) {
        return login;
      }
      return name;
    }
  }, (_applyDecoratedDescriptor(_obj, 'login', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'login'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'displayName', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'displayName'), _obj)), _obj)));
});