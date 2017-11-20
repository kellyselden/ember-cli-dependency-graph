define('travis/components/repo-actions', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed', 'travis/utils/eventually', 'ember-concurrency'], function (exports, _service, _object, _computed, _eventually, _emberConcurrency) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('type', 'job', 'build'), _dec3 = (0, _object.computed)('job', 'build'), _dec4 = (0, _object.computed)('repo', 'user', 'user.permissions.[]'), _dec5 = (0, _object.computed)('repo', 'user', 'user.pullPermissions.[]'), _dec6 = (0, _object.computed)('repo', 'user', 'user.pushPermissions.[]'), _dec7 = (0, _computed.and)('userHasPullPermissionForRepo', 'item.canCancel'), _dec8 = (0, _computed.and)('userHasPullPermissionForRepo', 'item.canRestart'), _dec9 = (0, _computed.and)('userHasPushPermissionForRepo', 'item.canDebug'), (_obj = { flashes: null,
    auth: null,

    classNames: ['repo-main-tools'],
    classNameBindings: ['labelless'],

    user: null,

    item: function item(type, job, build) {
      if (type === 'job') {
        return job;
      } else {
        return build;
      }
    },
    type: function type(job) {
      if (job) {
        return 'job';
      } else {
        return 'build';
      }
    },
    userHasPermissionForRepo: function userHasPermissionForRepo(repo, user) {
      if (user && repo) {
        return user.hasAccessToRepo(repo);
      }
    },
    userHasPullPermissionForRepo: function userHasPullPermissionForRepo(repo, user) {
      if (user && repo) {
        return user.hasPullAccessToRepo(repo);
      }
    },
    userHasPushPermissionForRepo: function userHasPushPermissionForRepo(repo, user) {
      if (user && repo) {
        return user.hasPushAccessToRepo(repo);
      }
    },
    canCancel: null,
    canRestart: null,
    canDebug: null,

    cancel: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      var type;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              type = this.get('type');
              _context.next = 3;
              return (0, _eventually.default)(this.get('item'), function (record) {
                record.cancel().then(function () {
                  _this.get('flashes').success(type.capitalize() + ' has been successfully cancelled.');
                }, function (xhr) {
                  _this.displayFlashError(xhr.status, 'cancel');
                });
              });

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    restarters: (0, _emberConcurrency.taskGroup)().drop(),

    restart: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _this2 = this;

      var type;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              type = this.get('type');
              _context2.next = 3;
              return (0, _eventually.default)(this.get('item'), function (record) {
                record.restart().then(function () {
                  _this2.get('flashes').success('The ' + type + ' was successfully restarted.');
                }, function () {
                  _this2.get('flashes').error('An error occurred. The ' + type + ' could not be restarted.');
                });
              });

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })).group('restarters'),

    debug: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var _this3 = this;

      var type;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              type = this.get('type');
              _context3.next = 3;
              return (0, _eventually.default)(this.get('item'), function (record) {
                record.debug().then(function () {
                  _this3.get('flashes').notice('The ' + type + ' was successfully restarted in debug mode\n            but make sure to watch the log for a host to connect to.');
                }, function () {
                  _this3.get('flashes').error('An error occurred. The ' + type + ' could not be restarted in debug mode.');
                });
              });

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })).group('restarters'),

    displayFlashError: function displayFlashError(status, action) {
      var type = this.get('type');
      if (status === 422 || status === 400) {
        var actionTerm = action === 'restart' ? 'restarted' : 'canceled';
        this.get('flashes').error('This ' + type + ' can\u2019t be ' + actionTerm);
      } else if (status === 403) {
        var _actionTerm = action === 'restart' ? 'restart' : 'cancel';
        this.get('flashes').error('You don\u2019t have sufficient access to ' + _actionTerm + ' this ' + type);
      } else {
        var _actionTerm2 = action === 'restart' ? 'restarting' : 'canceling';
        this.get('flashes').error('An error occurred when ' + _actionTerm2 + ' the ' + type);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'user', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'user'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'item', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'item'), _obj), _applyDecoratedDescriptor(_obj, 'type', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'type'), _obj), _applyDecoratedDescriptor(_obj, 'userHasPermissionForRepo', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'userHasPermissionForRepo'), _obj), _applyDecoratedDescriptor(_obj, 'userHasPullPermissionForRepo', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'userHasPullPermissionForRepo'), _obj), _applyDecoratedDescriptor(_obj, 'userHasPushPermissionForRepo', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'userHasPushPermissionForRepo'), _obj), _applyDecoratedDescriptor(_obj, 'canCancel', [_dec7], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'canCancel'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'canRestart', [_dec8], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'canRestart'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'canDebug', [_dec9], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'canDebug'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj)), _obj)));
});