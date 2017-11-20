define('package-hint-historic-resolver/services/task', ['exports', 'ember-concurrency', 'moment', 'lodash/toPairs', 'package-hint-historic-resolver/utils/normalize-dependencies'], function (exports, _emberConcurrency, _moment, _toPairs, _normalizeDependencies) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var get = Ember.get;
    exports.default = Service.extend({
        requestCache: service(),
        githubAjax: service(),

        getCommit: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(repo, date) {
            var task, until, url, ajax, response;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            task = get(this, 'requestCache.cacheRequest');
                            until = (0, _moment.default)(date).toJSON();
                            url = 'repos/' + repo + '/commits?until=' + until;
                            ajax = get(this, 'githubAjax');
                            _context.next = 6;
                            return task.perform(url, ajax);

                        case 6:
                            response = _context.sent;
                            return _context.abrupt('return', response);

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })),

        getPackage: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(repo, commit) {
            var task, url, _ref, responseBody;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            task = get(this, 'requestCache.cacheRequest');
                            url = 'https://raw.githubusercontent.com/' + repo + '/' + commit + '/package.json';
                            _context2.next = 4;
                            return task.perform(url);

                        case 4:
                            _ref = _context2.sent;
                            responseBody = _ref.responseBody;
                            return _context2.abrupt('return', responseBody);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })),

        getVersions: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(module) {
            var task, url, _ref2, responseBody, versions;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            task = get(this, 'requestCache.cacheRequest');
                            url = 'npm/' + module + '/versions';
                            _context3.next = 4;
                            return task.perform(url);

                        case 4:
                            _ref2 = _context3.sent;
                            responseBody = _ref2.responseBody;
                            versions = (0, _toPairs.default)(responseBody);
                            return _context3.abrupt('return', versions);

                        case 8:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })),

        getDependencies: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(module, version) {
            var task, url, _ref3, responseBody, dependencies;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            task = get(this, 'requestCache.cacheRequest');
                            url = 'npm/' + module + '@' + version + '/dependencies';
                            _context4.next = 4;
                            return task.perform(url);

                        case 4:
                            _ref3 = _context4.sent;
                            responseBody = _ref3.responseBody;
                            dependencies = (0, _normalizeDependencies.default)(responseBody);
                            return _context4.abrupt('return', dependencies);

                        case 8:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }))
    });
});