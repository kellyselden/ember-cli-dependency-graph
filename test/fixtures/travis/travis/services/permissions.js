define('travis/services/permissions', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _service, _object, _computed) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2;

  var Service = Ember.Service;
  exports.default = Service.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('currentUser.permissions.[]', 'currentUser.pushPermissions.[]', 'currentUser.adminPermissions.[]'), (_obj = { auth: null,

    init: function init() {
      this.get('all');
      return this._super.apply(this, arguments);
    },
    currentUser: null,

    all: function all() {
      return null;
    },
    hasPermission: function hasPermission(repo) {
      return this.checkPermission(repo, 'permissions');
    },
    hasPushPermission: function hasPushPermission(repo) {
      return this.checkPermission(repo, 'pushPermissions');
    },
    hasAdminPermission: function hasAdminPermission(repo) {
      return this.checkPermission(repo, 'adminPermissions');
    },
    checkPermission: function checkPermission(repo, permissionsType) {
      var id = isNaN(repo) ? repo.get('id') : repo;
      var currentUser = this.get('currentUser');
      if (currentUser) {
        return currentUser.get(permissionsType).includes(parseInt(id));
      } else {
        return false;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'all', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'all'), _obj)), _obj)));
});