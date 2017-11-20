define('travis/services/auth', ['exports', 'travis/config/environment', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service'], function (exports, _environment, _object, _computed, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7;

  var observer = Ember.observer;
  var isEmpty = Ember.isEmpty;
  var EmberPromise = Ember.RSVP.Promise;
  var Service = Ember.Service;
  exports.default = Service.extend((_dec = (0, _object.computed)('state'), _dec2 = (0, _object.computed)('state'), _dec3 = (0, _object.computed)('state'), _dec4 = (0, _object.computed)('currentUser.{login,name}'), _dec5 = (0, _object.computed)('currentUser.gravatarId'), _dec6 = (0, _computed.alias)('currentUser.permissions'), (_obj = { router: null,
    flashes: null,
    store: null,
    storage: null,
    sessionStorage: null,
    ajax: null,

    state: 'signed-out',
    receivingEnd: location.protocol + '//' + location.host,
    tokenExpiredMsg: 'You\'ve been signed out, because your access token has expired.',

    token: function token() {
      return this.get('sessionStorage').getItem('travis.token');
    },
    assetToken: function assetToken() {
      return JSON.parse(this.get('sessionStorage').getItem('travis.user'))['token'];
    },


    endpoint: _environment.default.authEndpoint || _environment.default.apiEndpoint,

    signOut: function signOut() {
      this.get('sessionStorage').clear();
      this.get('storage').clear();
      this.set('state', 'signed-out');
      this.set('user', null);
      this.get('store').unloadAll();
      this.set('currentUser', null);
      this.clearNonAuthFlashes();
    },
    signIn: function signIn(data) {
      if (data) {
        this.autoSignIn(data);
      } else {
        this.set('state', 'signing-in');

        var url = new URL(window.location.href);

        if (url.pathname === '/plans') {
          url.pathname = '/';
        }

        window.location = this.get('endpoint') + '/auth/handshake?redirect_uri=' + url;
      }
    },
    autoSignIn: function autoSignIn(data) {
      var _this = this;

      if (!data) {
        data = this.userDataFrom(this.get('sessionStorage')) || this.userDataFrom(this.get('storage'));
      }

      if (data) {
        this.setData(data);
        this.refreshUserData().then(function () {}, function (xhr) {
          // if xhr is not defined it means that scopes are not correct,
          // so log the user out. Also log the user out if the response is 401
          // or 403
          if (!xhr || xhr.status === 401 || xhr.status === 403) {
            _this.get('flashes').error(_this.get('tokenExpiredMsg'));
            _this.signOut();
          }
        });
      }
    },
    userDataFrom: function userDataFrom(storage) {
      var token = void 0,
          user = void 0,
          userJSON = void 0;
      userJSON = storage.getItem('travis.user');
      if (userJSON != null) {
        user = JSON.parse(userJSON);
      }
      if (user != null ? user.user : void 0) {
        user = user.user;
      }
      token = storage.getItem('travis.token');
      if (user && token && this.validateUser(user)) {
        return {
          user: user,
          token: token
        };
      } else {
        storage.removeItem('travis.user');
        storage.removeItem('travis.token');
        return null;
      }
    },
    validateUser: function validateUser(user) {
      var _this2 = this;

      var fieldsToValidate = void 0,
          isTravisBecome = void 0;
      fieldsToValidate = ['id', 'login', 'token'];
      isTravisBecome = this.get('sessionStorage').getItem('travis.become');
      if (!isTravisBecome) {
        fieldsToValidate.push('correct_scopes');
      }
      if (this.get('features.proVersion')) {
        fieldsToValidate.push('channels');
      }
      return fieldsToValidate.every(function (field) {
        return _this2.validateHas(field, user);
      }) && (isTravisBecome || user.correct_scopes);
    },
    validateHas: function validateHas(field, user) {
      if (user[field]) {
        return true;
      } else {
        return false;
      }
    },
    setData: function setData(data) {
      var user = void 0;
      this.storeData(data, this.get('sessionStorage'));
      if (!this.userDataFrom(this.get('storage'))) {
        this.storeData(data, this.get('storage'));
      }
      user = this.loadUser(data.user);
      this.set('currentUser', user);
      this.set('state', 'signed-in');
      Travis.trigger('user:signed_in', data.user);
    },
    refreshUserData: function refreshUserData(user) {
      var _this3 = this;

      if (!user) {
        var data = this.userDataFrom(this.get('sessionStorage')) || this.userDataFrom(this.get('storage'));
        if (data) {
          user = data.user;
        }
      }
      if (user) {
        return this.get('ajax').get('/users/' + user.id).then(function (data) {
          var userRecord = void 0;
          if (data.user.correct_scopes) {
            userRecord = _this3.loadUser(data.user);
            userRecord.get('permissions');
            if (_this3.get('signedIn')) {
              data.user.token = user.token;
              _this3.storeData(data, _this3.get('sessionStorage'));
              _this3.storeData(data, _this3.get('storage'));
              Travis.trigger('user:refreshed', data.user);
            }
          } else {
            return EmberPromise.reject();
          }
        });
      } else {
        return EmberPromise.resolve();
      }
    },
    signedIn: function signedIn(state) {
      return state === 'signed-in';
    },
    signedOut: function signedOut(state) {
      return state === 'signed-out';
    },
    signingIn: function signingIn(state) {
      return state === 'signing-in';
    },
    storeData: function storeData(data, storage) {
      if (data.token) {
        storage.setItem('travis.token', data.token);
      }
      return storage.setItem('travis.user', JSON.stringify(data.user));
    },
    loadUser: function loadUser(user) {
      var store = this.get('store'),
          userClass = store.modelFor('user'),
          serializer = store.serializerFor('user'),
          normalized = serializer.normalizeResponse(store, userClass, user, null, 'findRecord');

      store.push(normalized);
      return store.recordForId('user', user.id);
    },
    expectedOrigin: function expectedOrigin() {
      var endpoint = this.get('endpoint');
      if (endpoint && endpoint[0] === '/') {
        return this.receivingEnd;
      } else {
        var matches = endpoint.match(/^https?:\/\/[^\/]*/);
        if (matches && matches.length) {
          return matches[0];
        }
      }
    },
    clearNonAuthFlashes: function clearNonAuthFlashes() {
      var flashMessages = this.get('flashes.flashes.content') || [];
      var errorMessages = flashMessages.filterBy('type', 'error');
      if (!isEmpty(errorMessages)) {
        var errMsg = errorMessages.get('firstObject.message');
        if (errMsg !== this.get('tokenExpiredMsg')) {
          return this.get('flashes').clear();
        }
      } else {
        return this.get('flashes').clear();
      }
    },
    sync: function sync() {
      return this.get('currentUser').sync();
    },


    syncingDidChange: observer('isSyncing', 'currentUser', function () {
      var user = this.get('currentUser');
      if (user && user.get('isSyncing') && !user.get('syncedAt')) {
        return this.get('router').transitionTo('first_sync');
      }
    }),

    userName: function userName(login, name) {
      return name || login;
    },
    gravatarUrl: function gravatarUrl(gravatarId) {
      return location.protocol + '//www.gravatar.com/avatar/' + gravatarId + '?s=48&d=mm';
    },
    permissions: null
  }, (_applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'router'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'store'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'storage', [_service.service], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'storage'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'sessionStorage', [_service.service], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'sessionStorage'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'signedIn', [_dec], Object.getOwnPropertyDescriptor(_obj, 'signedIn'), _obj), _applyDecoratedDescriptor(_obj, 'signedOut', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'signedOut'), _obj), _applyDecoratedDescriptor(_obj, 'signingIn', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'signingIn'), _obj), _applyDecoratedDescriptor(_obj, 'userName', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'userName'), _obj), _applyDecoratedDescriptor(_obj, 'gravatarUrl', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'gravatarUrl'), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_dec6], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'permissions'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj)), _obj)));
});