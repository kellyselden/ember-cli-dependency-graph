define('ghost-admin/components/gh-loading-spinner', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({
        tagName: '',

        showSpinner: false,
        // ms until the loader is displayed,
        // prevents unnecessary flash of spinner
        slowLoadTimeout: 200,

        startSpinnerTimeout: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _emberConcurrency.timeout)(this.get('slowLoadTimeout'));

                        case 2:
                            this.set('showSpinner', true);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })),

        didInsertElement: function didInsertElement() {
            this.get('startSpinnerTimeout').perform();
        }
    });
});