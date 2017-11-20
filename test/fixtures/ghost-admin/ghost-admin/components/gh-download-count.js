define('ghost-admin/components/gh-download-count', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    var testing = Ember.testing;

    var INTERVAL = testing ? 20 : 2000;

    exports.default = Component.extend({
        ajax: service(),
        ghostPaths: service(),

        tagName: '',
        count: '',

        _poll: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var url, pattern, data, count;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            url = this.get('ghostPaths.count');
                            pattern = /(-?\d+)(\d{3})/;
                            _context.prev = 2;
                            _context.next = 5;
                            return this.get('ajax').request(url);

                        case 5:
                            data = _context.sent;
                            count = data.count.toString();


                            while (pattern.test(count)) {
                                count = count.replace(pattern, '$1,$2');
                            }

                            this.set('count', count);

                            if (testing) {
                                _context.next = 13;
                                break;
                            }

                            _context.next = 12;
                            return (0, _emberConcurrency.timeout)(INTERVAL);

                        case 12:
                            this.get('_poll').perform();

                        case 13:
                            _context.next = 17;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](2);

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 15]]);
        })
        // no-op - we don't want to create noise for a failed download count
        ),

        didInsertElement: function didInsertElement() {
            this.get('_poll').perform();
        }
    });
});