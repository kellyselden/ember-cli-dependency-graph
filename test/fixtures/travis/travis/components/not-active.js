define('travis/components/not-active', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-concurrency'], function (exports, _environment, _service, _object, _computed, _emberConcurrency) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2, _init3, _init4;

  var $ = Ember.$;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('repo', 'repo.permissions.admin'), (_obj = { auth: null,
    flashes: null,
    permissions: null,

    user: null,

    canActivate: function canActivate(repo, adminPermissions) {
      if (repo) {
        return adminPermissions;
      }
      return false;
    },


    activate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var apiEndpoint, repoId, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              apiEndpoint = _environment.default.apiEndpoint;
              repoId = this.get('repo.id');
              _context.prev = 2;
              _context.next = 5;
              return $.ajax(apiEndpoint + '/repo/' + repoId + '/activate', {
                headers: {
                  Authorization: 'token ' + this.get('auth').token(),
                  'Travis-API-Version': '3'
                },
                method: 'POST'
              });

            case 5:
              response = _context.sent;


              if (response.active) {
                this.get('pusher').subscribe('repo-' + repoId);

                this.get('repo').set('active', true);
                this.get('flashes').success('Repository has been successfully activated.');
              }
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](2);

              this.get('flashes').error('There was an error while trying to activate the repository.');

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 9]]);
    })).drop()
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'permissions'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'user', [_dec], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'user'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'canActivate', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'canActivate'), _obj)), _obj)));
});