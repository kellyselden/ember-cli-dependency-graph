define('ghost-admin/controllers/settings/apps/unsplash', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
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

        model: alias('settings.unsplash'),
        dirtyAttributes: null,
        rollbackValue: null,

        leaveSettingsTransition: null,

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var unsplash, settings;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            unsplash = this.get('model');
                            settings = this.get('settings');
                            _context.prev = 2;

                            settings.set('unsplash', unsplash);
                            this.set('dirtyAttributes', false);
                            this.set('rollbackValue', null);
                            _context.next = 8;
                            return settings.save();

                        case 8:
                            return _context.abrupt('return', _context.sent);

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](2);

                            if (!_context.t0) {
                                _context.next = 16;
                                break;
                            }

                            this.get('notifications').showAPIError(_context.t0);
                            throw _context.t0;

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 11]]);
        })).drop(),

        actions: {
            save: function save() {
                this.get('save').perform();
            },
            update: function update(value) {
                if (!this.get('dirtyAttributes')) {
                    this.set('rollbackValue', this.get('model.isActive'));
                }
                this.set('model.isActive', value);
                this.set('dirtyAttributes', true);
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

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // roll back changes on model props
                this.set('model.isActive', this.get('rollbackValue'));
                this.set('dirtyAttributes', false);
                this.set('rollbackValue', null);

                return transition.retry();
            }
        }
    });
});