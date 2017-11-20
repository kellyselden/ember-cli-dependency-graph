define('travis/models/user', ['exports', 'ember-data/model', 'travis/config/environment', 'ember-data/attr', 'ember-decorators/service', 'ember-decorators/object'], function (exports, _model, _environment, _attr, _service, _object) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _desc, _value, _obj, _init, _init2;

  var ArrayProxy = Ember.ArrayProxy;
  var next = Ember.run.next;
  var observer = Ember.observer;
  exports.default = _model.default.extend((_dec = (0, _object.computed)('name', 'login'), _dec2 = (0, _object.computed)('login'), _dec3 = (0, _object.computed)(), _dec4 = (0, _object.computed)('_rawPermissions'), _dec5 = (0, _object.computed)('_rawPermissions'), _dec6 = (0, _object.computed)('_rawPermissions'), _dec7 = (0, _object.computed)('_rawPermissions'), _dec8 = (0, _object.computed)('_rawPermissions'), (_obj = { ajax: null,
    sessionStorage: null,

    name: (0, _attr.default)(),
    email: (0, _attr.default)(),
    login: (0, _attr.default)(),
    token: (0, _attr.default)(),
    gravatarId: (0, _attr.default)(),
    isSyncing: (0, _attr.default)('boolean'),
    syncedAt: (0, _attr.default)(),
    repoCount: (0, _attr.default)('number'),
    avatarUrl: (0, _attr.default)(),

    fullName: function fullName(name, login) {
      return name || login;
    },


    isSyncingDidChange: observer('isSyncing', function () {
      return next(this, function () {
        if (this.get('isSyncing')) {
          return this.poll();
        }
      });
    }),

    urlGithub: function urlGithub(login) {
      return _environment.default.sourceEndpoint + '/' + login;
    },
    _rawPermissions: function _rawPermissions() {
      return this.get('ajax').get('/users/permissions');
    },
    permissions: function permissions(_rawPermissions) {
      var permissions = ArrayProxy.create({
        content: []
      });
      _rawPermissions.then(function (data) {
        return permissions.set('content', data.permissions);
      });
      return permissions;
    },
    adminPermissions: function adminPermissions(_rawPermissions) {
      var permissions = ArrayProxy.create({
        content: []
      });
      _rawPermissions.then(function (data) {
        return permissions.set('content', data.admin);
      });
      return permissions;
    },
    pullPermissions: function pullPermissions(_rawPermissions) {
      var permissions = ArrayProxy.create({
        content: []
      });
      _rawPermissions.then(function (data) {
        return permissions.set('content', data.pull);
      });
      return permissions;
    },
    pushPermissions: function pushPermissions(_rawPermissions) {
      var permissions = ArrayProxy.create({
        content: []
      });
      _rawPermissions.then(function (data) {
        return permissions.set('content', data.push);
      });
      return permissions;
    },
    pushPermissionsPromise: function pushPermissionsPromise(_rawPermissions) {
      return _rawPermissions.then(function (data) {
        return data.pull;
      });
    },
    hasAccessToRepo: function hasAccessToRepo(repo) {
      var id = repo.get ? repo.get('id') : repo;
      var permissions = this.get('permissions');
      if (permissions) {
        return permissions.includes(parseInt(id));
      }
    },
    hasPullAccessToRepo: function hasPullAccessToRepo(repo) {
      var id = repo.get ? repo.get('id') : repo;
      var permissions = this.get('pullPermissions');
      if (permissions) {
        return permissions.includes(parseInt(id));
      }
    },
    hasPushAccessToRepo: function hasPushAccessToRepo(repo) {
      var id = repo.get ? repo.get('id') : repo;
      var permissions = this.get('pushPermissions');
      if (permissions) {
        return permissions.includes(parseInt(id));
      }
    },


    type: 'user',

    sync: function sync() {
      var _this = this;

      var callback = function callback() {
        _this.setWithSession('isSyncing', true);
      };
      return this.get('ajax').post('/users/sync', {}, callback);
    },
    poll: function poll() {
      var _this2 = this;

      return this.get('ajax').get('/users', function (data) {
        if (data.user.is_syncing) {
          return setTimeout(function () {
            _this2.poll();
          }, 3000);
        } else {
          _this2.set('isSyncing', false);
          _this2.setWithSession('syncedAt', data.user.synced_at);
          Travis.trigger('user:synced', data.user);
          return _this2.store.query('account', {});
        }
      });
    },
    setWithSession: function setWithSession(name, value) {
      var user = void 0;
      this.set(name, value);
      user = JSON.parse(this.get('sessionStorage').getItem('travis.user'));
      user[name.underscore()] = this.get(name);
      return this.get('sessionStorage').setItem('travis.user', JSON.stringify(user));
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'sessionStorage', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'sessionStorage'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'fullName', [_dec], Object.getOwnPropertyDescriptor(_obj, 'fullName'), _obj), _applyDecoratedDescriptor(_obj, 'urlGithub', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'urlGithub'), _obj), _applyDecoratedDescriptor(_obj, '_rawPermissions', [_dec3], Object.getOwnPropertyDescriptor(_obj, '_rawPermissions'), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'permissions'), _obj), _applyDecoratedDescriptor(_obj, 'adminPermissions', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'adminPermissions'), _obj), _applyDecoratedDescriptor(_obj, 'pullPermissions', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'pullPermissions'), _obj), _applyDecoratedDescriptor(_obj, 'pushPermissions', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'pushPermissions'), _obj), _applyDecoratedDescriptor(_obj, 'pushPermissionsPromise', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'pushPermissionsPromise'), _obj)), _obj)));
});