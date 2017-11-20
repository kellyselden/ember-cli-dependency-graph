define('travis/controllers/account', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('model.{name,login}'), _dec3 = (0, _object.computed)(), _dec4 = (0, _object.computed)(), _dec5 = (0, _object.computed)('model.{type,login}'), _dec6 = (0, _object.computed)('model.{subscribed,education}', 'billingUrl'), (_obj = { auth: null,
    externalLinks: null,

    user: null,

    sync: function sync() {
      return this.get('user').sync();
    },
    toggle: function toggle(hook) {
      return hook.toggle();
    },
    accountName: function accountName(name, login) {
      return name || login;
    },
    showPrivateReposHint: function showPrivateReposHint() {
      return this.config.show_repos_hint === 'private';
    },
    showPublicReposHint: function showPublicReposHint() {
      return this.config.show_repos_hint === 'public';
    },
    billingUrl: function billingUrl(type, login) {
      var id = type === 'user' ? 'user' : login;
      return this.config.billingEndpoint + '/subscriptions/' + id;
    },
    subscribeButtonInfo: function subscribeButtonInfo(subscribed, education, billingUrl) {
      return {
        billingUrl: billingUrl,
        subscribed: subscribed,
        education: education
      };
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'user', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'user'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'sync', [_object.action], Object.getOwnPropertyDescriptor(_obj, 'sync'), _obj), _applyDecoratedDescriptor(_obj, 'toggle', [_object.action], Object.getOwnPropertyDescriptor(_obj, 'toggle'), _obj), _applyDecoratedDescriptor(_obj, 'accountName', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'accountName'), _obj), _applyDecoratedDescriptor(_obj, 'showPrivateReposHint', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'showPrivateReposHint'), _obj), _applyDecoratedDescriptor(_obj, 'showPublicReposHint', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'showPublicReposHint'), _obj), _applyDecoratedDescriptor(_obj, 'billingUrl', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'billingUrl'), _obj), _applyDecoratedDescriptor(_obj, 'subscribeButtonInfo', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'subscribeButtonInfo'), _obj)), _obj)));
});