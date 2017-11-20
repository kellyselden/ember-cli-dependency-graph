define('package-hint-historic-resolver/services/request-cache', ['exports', 'ember-concurrency', 'package-hint-historic-resolver/utils/parse-response-headers'], function (exports, _emberConcurrency, _parseResponseHeaders) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var readOnly = Ember.computed.readOnly;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    config: service(),
    cache: service(),
    limiter: service(),
    adapter: service(),
    defaultAjax: service(),

    cacheTime: readOnly('config.cacheTime'),

    cacheRequest: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, ajax) {
      var _this = this;

      var cache, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              cache = get(this, 'cache');

              // don't bother waiting for anything
              // if the cache has a value

              data = cache.get(url);

              if (!data) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', data);

            case 4:
              _context.next = 6;
              return get(this, 'limiter.removeTokens').perform(1).then(function () {
                // while you were waiting in the limiter
                // the data could have since been cached
                // so check again
                data = cache.get(url);
                if (data) {
                  return data;
                }

                return get(_this, '_cacheRequest').perform(url, ajax);
              });

            case 6:
              return _context.abrupt('return', _context.sent);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })),
    _cacheRequest: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, ajax) {
      var _this2 = this;

      var cache, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cache = get(this, 'cache');

              // while you were waiting in the task queue
              // the data could have since been cached
              // so check again

              data = cache.get(url);

              if (!data) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return', data);

            case 4:

              ajax = ajax || get(this, 'defaultAjax');
              _context2.next = 7;
              return ajax.raw(url).then(function (_ref) {
                var jqXHR = _ref.jqXHR,
                    response = _ref.response;

                var responseHeaders = jqXHR.getAllResponseHeaders();
                responseHeaders = (0, _parseResponseHeaders.default)(responseHeaders);
                var data = {
                  responseHeaders: responseHeaders,
                  responseBody: response
                };
                return cache.put(url, data, get(_this2, 'cacheTime'));
              });

            case 7:
              return _context2.abrupt('return', _context2.sent);

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })).enqueue()
  });
});