define('travis/services/repositories', ['exports', 'travis/config/environment', 'travis/models/repo', 'ember-concurrency', 'ember-decorators/object', 'ember-decorators/service'], function (exports, _environment, _repo, _emberConcurrency, _object, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5;

  var isArray = Ember.isArray;
  var isEmpty = Ember.isEmpty;
  var Service = Ember.Service;
  exports.default = Service.extend((_dec = (0, _object.computed)('requestOwnedRepositories', 'performSearchRequest', 'showSearchResults'), _dec2 = (0, _object.computed)('tasks.@each.isRunning'), _dec3 = (0, _object.computed)('_repos.[]', '_repos.@each.{currentBuildFinishedAt,currentBuildId}'), _dec4 = (0, _object.computed)('_searchResults.[]', '_searchResults.@each.{currentBuildFinishedAt,currentBuildId}'), (_obj = { auth: null,
    store: null,
    tabStates: null,
    ajax: null,
    router: null,

    tasks: function tasks(accessible, performSearch, showSearch) {
      return [accessible, performSearch, showSearch];
    },
    loadingData: function loadingData(tasks) {
      return tasks.any(function (task) {
        return task.get('isRunning');
      });
    },


    performSearchRequest: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var store, ajax, query, urlQuery, searchResults;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              store = this.get('store');
              ajax = this.get('ajax');
              query = this.get('searchQuery');
              urlQuery = this.get('router._router.currentURL').split('/')[2];

              if (!(!this.get('_searchResults.length') || urlQuery !== query)) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return _repo.default.search(store, ajax, query);

            case 7:
              searchResults = _context.sent;

              this.set('_searchResults', searchResults);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    showSearchResults: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var query;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = this.get('searchQuery');
              _context2.next = 3;
              return (0, _emberConcurrency.timeout)(_environment.default.intervals.repositorySearchDebounceRate);

            case 3:
              _context2.next = 5;
              return this.get('performSearchRequest').perform(query);

            case 5:

              query = query.replace(/\//g, '%2F');
              this.get('router').transitionTo('search', query);

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })).restartable(),

    requestOwnedRepositories: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var user, permissions, repositories;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (isEmpty(this.get('ownedRepos'))) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt('return', this.set('_repos', this.get('ownedRepos')));

            case 4:
              user = this.get('auth.currentUser');

              if (!user) {
                _context3.next = 15;
                break;
              }

              _context3.next = 8;
              return user.get('_rawPermissions');

            case 8:
              permissions = _context3.sent;
              _context3.next = 11;
              return _repo.default.accessibleBy(this.get('store'), permissions.pull);

            case 11:
              repositories = _context3.sent;

              this.set('_repos', repositories);
              this.set('ownedRepos', repositories);
              return _context3.abrupt('return', repositories);

            case 15:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })).drop(),

    accessible: function accessible(repos) {
      return this.sortData(repos);
    },
    searchResults: function searchResults(repos) {
      return this.sortData(repos);
    },
    sortData: function sortData(repos) {
      if (repos && repos.toArray) {
        repos = repos.toArray();
      }

      if (repos && repos.sort) {
        return repos.sort(function (repo1, repo2) {
          var buildId1 = repo1.get('currentBuild.id');
          var buildId2 = repo2.get('currentBuild.id');
          var finishedAt1 = repo1.get('currentBuild.finishedAt');
          var finishedAt2 = repo2.get('currentBuild.finishedAt');

          if (!buildId1 && !buildId2) {
            // if both repos lack builds, put newer repo first
            return repo1.get('id') > repo2.get('id') ? -1 : 1;
          } else if (buildId1 && !buildId2) {
            // if only repo1 has a build, it goes first
            return -1;
          } else if (buildId2 && !buildId1) {
            // if only repo2 has a build, it goes first
            return 1;
          }

          if (finishedAt1) {
            finishedAt1 = new Date(finishedAt1);
          }
          if (finishedAt2) {
            finishedAt2 = new Date(finishedAt2);
          }

          if (finishedAt1 && finishedAt2) {
            // if both builds finished, put newer first
            return finishedAt1.getTime() > finishedAt2.getTime() ? -1 : 1;
          } else if (finishedAt1 && !finishedAt2) {
            // if repo1 finished, but repo2 didn't, put repo2 first
            return 1;
          } else if (finishedAt2 && !finishedAt1) {
            // if repo2 finisher, but repo1 didn't, put repo1 first
            return -1;
          } else {
            // none of the builds finished, put newer build first
            return buildId1 > buildId2 ? -1 : 1;
          }
        });
      } else {
        if (isArray(repos)) {
          return repos;
        } else {
          return [];
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'store'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'router'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tasks', [_dec], Object.getOwnPropertyDescriptor(_obj, 'tasks'), _obj), _applyDecoratedDescriptor(_obj, 'loadingData', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'loadingData'), _obj), _applyDecoratedDescriptor(_obj, 'accessible', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'accessible'), _obj), _applyDecoratedDescriptor(_obj, 'searchResults', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'searchResults'), _obj)), _obj)));
});