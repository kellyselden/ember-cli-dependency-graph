define('ghost-admin/components/modal-delete-subscriber', ['exports', 'ghost-admin/components/modal-base', 'ember-invoke-action', 'ember-concurrency'], function (exports, _modalBase, _emberInvokeAction, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var alias = Ember.computed.alias;
    exports.default = _modalBase.default.extend({

        subscriber: alias('model'),

        deleteSubscriber: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _emberInvokeAction.invokeAction)(this, 'confirm');

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).drop(),

        actions: {
            confirm: function confirm() {
                this.get('deleteSubscriber').perform();
            }
        }
    });
});