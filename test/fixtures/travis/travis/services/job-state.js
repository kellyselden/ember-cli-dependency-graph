define('travis/services/job-state', ['exports', 'ember-concurrency', 'ember-decorators/service'], function (exports, _emberConcurrency, _service) {
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

  var _desc, _value, _obj, _init;

  var merge = Ember.merge;
  var isEmpty = Ember.isEmpty;
  var Service = Ember.Service;


  var fetchAll = function fetchAll(store, type, query) {
    store.query(type, query).then(function (collection) {
      var nextPage = collection.get('meta.pagination.next');
      if (nextPage) {
        var limit = nextPage.limit,
            offset = nextPage.offset;

        fetchAll(store, type, merge(query, { limit: limit, offset: offset }));
      }
    });
  };

  exports.default = Service.extend((_obj = { store: null,

    runningJobs: [],
    queuedJobs: [],

    fetchRunningJobs: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var runningJobs, runningStates, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              runningJobs = this.get('runningJobs');

              if (isEmpty(runningJobs)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', runningJobs);

            case 3:
              runningStates = ['started', 'received'];
              _context.next = 6;
              return this.get('store').filter('job', function (job) {
                return runningStates.includes(job.get('state'));
              });

            case 6:
              result = _context.sent;


              // we don't run a query in filter above, because we want to get *all*
              // of the running jobs, so if there's more than a page size, we need to
              // paginate
              fetchAll(this.get('store'), 'job', { state: runningStates });

              result.set('isLoaded', true);
              this.set('runningJobs', result);

              return _context.abrupt('return', result);

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })),

    fetchQueuedJobs: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var queuedJobs, queuedStates, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              queuedJobs = this.get('queuedJobs');

              if (isEmpty(queuedJobs)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return', queuedJobs);

            case 3:
              queuedStates = ['created', 'queued'];
              _context2.next = 6;
              return this.get('store').filter('job', function (job) {
                return queuedStates.includes(job.get('state'));
              });

            case 6:
              result = _context2.sent;


              // we don't run a query in filter above, because we want to get *all*
              // of the queued jobs, so if there's more than a page size, we need to
              // paginate
              fetchAll(this.get('store'), 'job', { state: queuedStates });

              result.set('isLoaded', true);
              this.set('queuedJobs', result);

              return _context2.abrupt('return', result);

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }))
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});