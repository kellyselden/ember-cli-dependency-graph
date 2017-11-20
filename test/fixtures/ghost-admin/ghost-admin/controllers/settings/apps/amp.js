define('ghost-admin/controllers/settings/apps/amp', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var alias = Ember.computed.alias;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        notifications: service(),
        settings: service(),

        model: alias('settings.amp'),

        leaveSettingsTransition: null,

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var amp, settings;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            amp = this.get('model');
                            settings = this.get('settings');


                            settings.set('amp', amp);

                            _context.prev = 3;
                            _context.next = 6;
                            return settings.save();

                        case 6:
                            return _context.abrupt('return', _context.sent);

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](3);

                            this.get('notifications').showAPIError(_context.t0);
                            throw _context.t0;

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[3, 9]]);
        })).drop(),

        actions: {
            update: function update(value) {
                this.set('model', value);
            },
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
                var settings = this.get('settings');

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