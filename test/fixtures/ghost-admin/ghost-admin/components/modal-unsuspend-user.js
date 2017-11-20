define('ghost-admin/components/modal-unsuspend-user', ['exports', 'ghost-admin/components/modal-base', 'ember-invoke-action', 'ember-concurrency'], function (exports, _modalBase, _emberInvokeAction, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var alias = Ember.computed.alias;
    exports.default = _modalBase.default.extend({

        user: alias('model'),

        unsuspendUser: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return (0, _emberInvokeAction.invokeAction)(this, 'confirm');

                        case 3:
                            _context.prev = 3;

                            this.send('closeModal');
                            return _context.finish(3);

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0,, 3, 6]]);
        })).drop(),

        actions: {
            confirm: function confirm() {
                return this.get('unsuspendUser').perform();
            }
        }
    });
});