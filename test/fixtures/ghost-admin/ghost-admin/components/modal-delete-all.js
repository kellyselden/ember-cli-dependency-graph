define('ghost-admin/components/modal-delete-all', ['exports', 'ghost-admin/components/modal-base', 'ember-concurrency'], function (exports, _modalBase, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _modalBase.default.extend({

        ghostPaths: service(),
        notifications: service(),
        store: service(),
        ajax: service(),

        _deleteAll: function _deleteAll() {
            var deleteUrl = this.get('ghostPaths.url').api('db');
            return this.get('ajax').del(deleteUrl);
        },
        _unloadData: function _unloadData() {
            this.get('store').unloadAll('post');
            this.get('store').unloadAll('tag');
        },
        _showSuccess: function _showSuccess() {
            this.get('notifications').showAlert('All content deleted from database.', { type: 'success', key: 'all-content.delete.success' });
        },
        _showFailure: function _showFailure(error) {
            this.get('notifications').showAPIError(error, { key: 'all-content.delete' });
        },


        deleteAll: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return this._deleteAll();

                        case 3:
                            this._unloadData();
                            this._showSuccess();
                            _context.next = 10;
                            break;

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](0);

                            this._showFailure(_context.t0);

                        case 10:
                            _context.prev = 10;

                            this.send('closeModal');
                            return _context.finish(10);

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 7, 10, 13]]);
        })).drop(),

        actions: {
            confirm: function confirm() {
                this.get('deleteAll').perform();
            }
        }
    });
});