define('ghost-admin/components/modal-delete-post', ['exports', 'ghost-admin/components/modal-base', 'ember-concurrency'], function (exports, _modalBase, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var alias = Ember.computed.alias;
    var service = Ember.inject.service;
    exports.default = _modalBase.default.extend({

        post: alias('model.post'),
        onSuccess: alias('model.onSuccess'),

        notifications: service(),

        _deletePost: function _deletePost() {
            var post = this.get('post');

            // definitely want to clear the data store and post of any unsaved,
            // client-generated tags
            post.updateTags();

            return post.destroyRecord();
        },
        _success: function _success() {
            // clear any previous error messages
            this.get('notifications').closeAlerts('post.delete');

            // trigger the success action
            if (this.get('onSuccess')) {
                this.get('onSuccess')();
            }
        },
        _failure: function _failure(error) {
            this.get('notifications').showAPIError(error, { key: 'post.delete.failed' });
        },


        deletePost: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return this._deletePost();

                        case 3:
                            this._success();
                            _context.next = 9;
                            break;

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context['catch'](0);

                            this._failure(_context.t0);

                        case 9:
                            _context.prev = 9;

                            this.send('closeModal');
                            return _context.finish(9);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6, 9, 12]]);
        })).drop(),

        actions: {
            confirm: function confirm() {
                this.get('deletePost').perform();
            }
        }
    });
});