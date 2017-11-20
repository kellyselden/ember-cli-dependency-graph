define('ghost-admin/controllers/settings/code-injection', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        notifications: service(),

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var notifications;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            notifications = this.get('notifications');
                            _context.prev = 1;
                            _context.next = 4;
                            return this.get('model').save();

                        case 4:
                            return _context.abrupt('return', _context.sent);

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](1);

                            notifications.showAPIError(_context.t0, { key: 'code-injection.save' });
                            throw _context.t0;

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 7]]);
        })),

        actions: {
            save: function save() {
                this.get('save').perform();
            },
            toggleLeaveSettingsModal: function toggleLeaveSettingsModal(transition) {
                var leaveTransition = this.get('leaveSettingsTransition');

                if (!transition && this.get('showLeaveSettingsModal')) {
                    this.set('leaveSettingsTransition', null);
                    this.set('showLeaveSettingsModal', false);
                    return;
                }

                if (!leaveTransition || transition.targetName === leaveTransition.targetName) {
                    this.set('leaveSettingsTransition', transition);

                    // if a save is running, wait for it to finish then transition
                    if (this.get('save.isRunning')) {
                        return this.get('save.last').then(function () {
                            transition.retry();
                        });
                    }

                    // we genuinely have unsaved data, show the modal
                    this.set('showLeaveSettingsModal', true);
                }
            },
            leaveSettings: function leaveSettings() {
                var transition = this.get('leaveSettingsTransition');
                var settings = this.get('model');

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // roll back changes on model props
                settings.rollbackAttributes();

                return transition.retry();
            }
        }
    });
});