define('package-hint-historic-resolver/services/limiter', ['exports', 'ember-concurrency', 'npm:limiter', 'package-hint-historic-resolver/config/environment'], function (exports, _emberConcurrency, _npmLimiter, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Promise = Ember.RSVP.Promise;
  var set = Ember.set;
  var get = Ember.get;
  var readOnly = Ember.computed.readOnly;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  var cancel = Ember.run.cancel;
  var later = Ember.run.later;
  var run = Ember.run;
  var RateLimiter = _npmLimiter.default.RateLimiter;

  var isTestEnvironment = _environment.default.environment === 'test';

  exports.default = Service.extend({
    config: service(),

    _limiterTime: readOnly('config.limiterTime'),

    removeTokens: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(count) {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new Promise(function (resolve) {
                var limiter = get(_this, '_limiter');
                if (!limiter) {
                  limiter = new RateLimiter(1, get(_this, '_limiterTime'));

                  set(_this, '_limiter', limiter);
                }

                // we need a run loop open during testing for the wait helper to work
                var timer = void 0,
                    createDummyTimer = void 0,
                    assignDummyTimer = void 0;
                if (isTestEnvironment) {
                  createDummyTimer = function createDummyTimer() {
                    return later(assignDummyTimer);
                  };

                  assignDummyTimer = function assignDummyTimer() {
                    timer = createDummyTimer();
                  };

                  assignDummyTimer();
                }

                return limiter.removeTokens(count, function () {
                  if (isTestEnvironment) {
                    cancel(timer);
                  }

                  run(resolve);
                });
              });

            case 2:
              return _context.abrupt('return', _context.sent);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  });
});