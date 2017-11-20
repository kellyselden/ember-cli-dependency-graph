define('travis/components/repos-list-tabs', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _desc, _value, _obj, _init, _init2, _init3, _init4;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('tabStates.sidebarTab'), _dec2 = (0, _computed.alias)('auth.currentUser'), _dec3 = (0, _object.computed)('tab'), _dec4 = (0, _object.computed)('tab', 'currentUser'), _dec5 = (0, _object.computed)('currentUser'), (_obj = { auth: null,
    tabStates: null,

    tagName: 'nav',
    classNames: ['travistab-nav', 'travistab-nav--underline', 'travistab-nav--sidebar'],

    tab: null,

    currentUser: null,

    classRunning: function classRunning(tab) {
      return tab === 'running' ? 'active' : '';
    },
    classOwned: function classOwned(tab, currentUser) {
      var classes = [];
      if (tab === 'owned') {
        classes.push('active');
      }
      if (currentUser) {
        classes.push('display-inline');
      }
      return classes.join(' ');
    },
    classNew: function classNew(currentUser) {
      if (currentUser) {
        return 'display-inline';
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec2], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'classRunning', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'classRunning'), _obj), _applyDecoratedDescriptor(_obj, 'classOwned', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'classOwned'), _obj), _applyDecoratedDescriptor(_obj, 'classNew', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'classNew'), _obj)), _obj)));
});