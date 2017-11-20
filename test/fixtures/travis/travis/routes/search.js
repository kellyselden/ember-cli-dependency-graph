define('travis/routes/search', ['exports', 'ember-decorators/service'], function (exports, _service) {
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

  var _desc, _value, _obj, _init, _init2, _init3;

  var Route = Ember.Route;
  exports.default = Route.extend((_obj = { tabStates: null,
    auth: null,
    repositories: null,

    redirect: function redirect() {
      if (!this.get('auth.signedIn')) {
        this.transitionTo('index');
      }
    },
    activate: function activate() {
      this.get('tabStates').set('sidebarTab', 'search');
      this._super.apply(this, arguments);
    },
    setupController: function setupController(controller, searchPhrase) {
      this._super.apply(this, arguments);
      this.set('repositories.searchQuery', searchPhrase);
    },
    model: function model(params) {
      return params.phrase.replace(/%2F/g, '/');
    },
    deactivate: function deactivate() {
      this._super.apply(this, arguments);
      this.set('repositories.searchQuery', undefined);
    }
  }, (_applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj)), _obj));
});