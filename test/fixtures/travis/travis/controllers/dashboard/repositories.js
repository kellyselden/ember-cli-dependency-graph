define('travis/controllers/dashboard/repositories', ['exports', 'ember-concurrency', 'ember-decorators/service', 'ember-decorators/object', 'travis/utils/dashboard-repositories-sort'], function (exports, _emberConcurrency, _service, _object, _dashboardRepositoriesSort) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2;

  var isBlank = Ember.isBlank;
  var isEqual = Ember.isEqual;
  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _object.computed)(), _dec2 = (0, _object.computed)('model.starredRepos.[]', 'model.starredRepos.@each.currentBuildState', 'model.starredRepos.@each.currentBuildFinishedAt'), _dec3 = (0, _object.computed)('model.repos.[]', 'account', 'model.accounts', 'model.repos.@each.currentBuildState', 'model.repos.@each.currentBuildFinishedAt'), _dec4 = (0, _object.computed)('model.accounts', 'account'), (_obj = {
    queryParams: ['account', 'offset'],
    offset: 0,

    flashes: null,
    ajax: null,

    starring: (0, _emberConcurrency.taskGroup)().drop(),

    tasks: function tasks() {
      return [this.get('star'), this.get('unstar')];
    },


    star: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(repo) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              repo.set('starred', true);
              _context.prev = 1;
              _context.next = 4;
              return this.get('ajax').postV3('/repo/' + repo.get('id') + '/star');

            case 4:
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](1);

              repo.set('starred', false);
              this.get('flashes').error('Something went wrong while trying to star  ' + repo.get('slug') + '.\n               Please try again.');

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 6]]);
    })).group('starring'),

    unstar: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(repo) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              repo.set('starred', false);
              _context2.prev = 1;
              _context2.next = 4;
              return this.get('ajax').postV3('/repo/' + repo.get('id') + '/unstar');

            case 4:
              _context2.next = 10;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2['catch'](1);

              repo.set('starred', true);
              this.get('flashes').error('Something went wrong while trying to unstar  ' + repo.get('slug') + '.\n               Please try again.');

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 6]]);
    })).group('starring'),

    starredRepos: function starredRepos(repositories) {
      return repositories.toArray().sort(_dashboardRepositoriesSort.default);
    },
    filteredRepos: function filteredRepos(repositories, accountParam, accounts) {
      var account = accounts.filter(function (x) {
        if (accountParam) {
          if (x.id === accountParam) {
            return x;
          }
        } else {
          return null;
        }
      });
      var type = null;
      if (account && account[0]) {
        type = account[0].get('type');
      }

      var repos = repositories.filter(function (item) {
        if (!isBlank(account)) {
          if (isEqual(type, 'user')) {
            if (isEqual(item.get('owner.@type'), 'user')) {
              return item;
            }
          } else {
            if (isEqual(item.get('owner.login'), accountParam)) {
              return item;
            }
          }
        } else {
          return item;
        }
      }).sort(_dashboardRepositoriesSort.default);
      return repos;
    },
    selectedOrg: function selectedOrg(accounts, account) {
      var filteredAccount = accounts.filter(function (item) {
        if (item.get('login') === account) {
          return item;
        }
      });
      return filteredAccount[0];
    },


    actions: {
      selectOrg: function selectOrg(org) {
        var login = isBlank(org) ? undefined : org.get('login');
        return this.set('account', login);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tasks', [_dec], Object.getOwnPropertyDescriptor(_obj, 'tasks'), _obj), _applyDecoratedDescriptor(_obj, 'starredRepos', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'starredRepos'), _obj), _applyDecoratedDescriptor(_obj, 'filteredRepos', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'filteredRepos'), _obj), _applyDecoratedDescriptor(_obj, 'selectedOrg', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'selectedOrg'), _obj)), _obj)));
});