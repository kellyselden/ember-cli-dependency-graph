define('travis/components/repository-sidebar', ['exports', 'npm:visibilityjs', 'ember-concurrency', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service'], function (exports, _npmVisibilityjs, _emberConcurrency, _object, _computed, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7, _init8, _init9, _init10;

  var isEmpty = Ember.isEmpty;
  var schedule = Ember.run.schedule;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _service.service)('updateTimes'), _dec2 = (0, _computed.alias)('runningJobs.length'), _dec3 = (0, _object.computed)('runningJobs.length', 'queuedJobs.length'), _dec4 = (0, _object.computed)('features.proVersion', 'jobState.runningJobs.[]'), _dec5 = (0, _object.computed)('features.proVersion', 'jobState.queuedJobs.[]'), _dec6 = (0, _computed.alias)('tabStates.sidebarTab'), _dec7 = (0, _object.computed)('tab', 'repositories.{searchResults.[],accessible.[]}'), _dec8 = (0, _object.computed)('tab'), (_obj = { tabStates: null,
    jobState: null,
    ajax: null,
    updateTimesService: null,
    repositories: null,
    store: null,
    auth: null,
    router: null,
    classNames: ['dupa'],

    didInsertElement: function didInsertElement() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._super(args);
      // this starts the fetch after the sidebar is rendered, which is not ideal.
      // But I'm otherwise unable to reference that state within two separate
      // templates...
      schedule('afterRender', function () {
        _this.get('fetchRepositoryData').perform();
        if (_this.get('features.proVersion')) {
          _this.get('jobState.fetchRunningJobs').perform();
          _this.get('jobState.fetchQueuedJobs').perform();
        }
      });
    },


    fetchRepositoryData: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this2 = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.get('repositories.searchQuery')) {
                _context.next = 6;
                break;
              }

              _context.next = 3;
              return this.get('repositories.performSearchRequest').perform();

            case 3:
              this.set('_data', this.get('repositories.searchResults'));
              _context.next = 9;
              break;

            case 6:
              _context.next = 8;
              return this.get('viewOwned').perform();

            case 8:
              this.set('_data', this.get('repositories.accessible'));

            case 9:

              if (!Ember.testing) {
                _npmVisibilityjs.default.every(this.config.intervals.updateTimes, function () {
                  var callback = function callback(record) {
                    return record.get('currentBuild');
                  };
                  var withCurrentBuild = _this2.get('_data').filter(callback).map(callback);
                  _this2.get('updateTimesService').push(withCurrentBuild);
                });
              }

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })),

    actions: {
      showRunningJobs: function showRunningJobs() {
        this.get('tabStates').set('sidebarTab', 'running');
      },

      showMyRepositories: function showMyRepositories() {
        this.set('tabStates.sidebarTab', 'owned');
        this.attrs.showRepositories();
      },

      onQueryChange: function onQueryChange(query) {
        if (query === '' || query === this.get('repositories.searchQuery')) {
          return;
        }
        this.set('repositories.searchQuery', query);
        this.get('repositories.showSearchResults').perform();
      }
    },

    startedJobsCount: null,

    allJobsCount: function allJobsCount(runningAmount, queuedAmount) {
      return runningAmount + queuedAmount;
    },
    runningJobs: function runningJobs(proVersion, _runningJobs) {
      if (!proVersion) {
        return [];
      }
      return _runningJobs;
    },
    queuedJobs: function queuedJobs(proVersion, _queuedJobs) {
      if (!proVersion) {
        return [];
      }
      return _queuedJobs;
    },


    viewOwned: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var ownedRepositories, onIndexPage;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.get('repositories.requestOwnedRepositories').perform();

            case 2:
              ownedRepositories = _context2.sent;
              onIndexPage = this.get('router.currentRouteName') === 'index';


              if (this.get('auth.signedIn') && isEmpty(ownedRepositories) && onIndexPage) {
                this.get('router').transitionTo('getting_started');
              }

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })),

    tab: null,

    repositoryResults: function repositoryResults(tab, searchResults, accessible) {
      if (tab === 'search') {
        return searchResults;
      }
      return accessible;
    },
    showRunningJobs: function showRunningJobs(tab) {
      return tab === 'running';
    }
  }, (_applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobState', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'jobState'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'updateTimesService', [_dec], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'updateTimesService'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'store'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init8 = Object.getOwnPropertyDescriptor(_obj, 'router'), _init8 = _init8 ? _init8.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init8;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'startedJobsCount', [_dec2], (_init9 = Object.getOwnPropertyDescriptor(_obj, 'startedJobsCount'), _init9 = _init9 ? _init9.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init9;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'allJobsCount', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'allJobsCount'), _obj), _applyDecoratedDescriptor(_obj, 'runningJobs', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'runningJobs'), _obj), _applyDecoratedDescriptor(_obj, 'queuedJobs', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'queuedJobs'), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec6], (_init10 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init10 = _init10 ? _init10.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init10;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositoryResults', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'repositoryResults'), _obj), _applyDecoratedDescriptor(_obj, 'showRunningJobs', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'showRunningJobs'), _obj)), _obj)));
});