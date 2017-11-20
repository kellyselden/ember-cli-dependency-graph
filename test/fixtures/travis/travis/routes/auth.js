define('travis/routes/auth', ['exports', 'travis/routes/basic', 'ember-decorators/service'], function (exports, _basic, _service) {
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

  var _desc, _value, _obj, _init;

  var $ = Ember.$;
  exports.default = _basic.default.extend((_obj = { auth: null,

    needsAuth: false,

    renderTemplate: function renderTemplate() {
      $('body').attr('id', 'auth');
      return this.render('signin');
    },
    deactivate: function deactivate() {
      return this.get('auth').set('redirected', false);
    },


    actions: {
      afterSignIn: function afterSignIn() {
        if (this.get('features.dashboard')) {
          this.transitionTo('dashboard');
        } else {
          this.transitionTo('index');
        }
        return true;
      }
    },

    redirect: function redirect() {
      if (this.signedIn()) {
        if (this.get('features.dashboard')) {
          return this.transitionTo('dashboard');
        } else {
          return this.transitionTo('index');
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});