define('travis/components/repo-show-tools', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _environment, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2, _init3;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('permissions.all', 'repo'), _dec3 = (0, _object.computed)('permissions.all', 'repo'), _dec4 = (0, _object.computed)('permissions.all', 'repo'), (_obj = { auth: null,
    permissions: null,

    tagName: 'nav',
    classNames: ['option-button'],
    classNameBindings: ['isOpen:is-open'],
    isOpen: false,

    currentUser: null,

    click: function click() {
      return this.toggleProperty('isOpen');
    },
    mouseLeave: function mouseLeave() {
      this.set('isOpen', false);
    },
    displaySettingsLink: function displaySettingsLink(permissions, repo) {
      return this.get('permissions').hasPushPermission(repo);
    },
    displayCachesLink: function displayCachesLink(permissions, repo) {
      return this.get('permissions').hasPushPermission(repo) && _environment.default.endpoints.caches;
    },
    displayStatusImages: function displayStatusImages(permissions, repo) {
      return this.get('permissions').hasPermission(repo);
    },


    actions: {
      triggerBuildModal: function triggerBuildModal() {
        this.get('onTriggerBuild')();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'permissions'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'displaySettingsLink', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'displaySettingsLink'), _obj), _applyDecoratedDescriptor(_obj, 'displayCachesLink', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'displayCachesLink'), _obj), _applyDecoratedDescriptor(_obj, 'displayStatusImages', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'displayStatusImages'), _obj)), _obj)));
});