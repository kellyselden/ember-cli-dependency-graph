define('ghost-admin/controllers/settings/apps/slack', ['exports', 'ghost-admin/utils/bound-one-way', 'ember-ajax/errors', 'ember-concurrency'], function (exports, _boundOneWay, _errors, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var empty = Ember.computed.empty;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        ghostPaths: service(),
        ajax: service(),
        notifications: service(),
        settings: service(),

        model: (0, _boundOneWay.default)('settings.slack.firstObject'),
        testNotificationDisabled: empty('model.url'),

        leaveSettingsTransition: null,
        slackArray: [],

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var slack, settings, slackArray;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            slack = this.get('model');
                            settings = this.get('settings');
                            slackArray = this.get('slackArray');
                            _context.prev = 3;
                            _context.next = 6;
                            return slack.validate();

                        case 6:
                            // clear existing objects in slackArray to make sure we only push the validated one
                            slackArray.clear().pushObject(slack);
                            _context.next = 9;
                            return settings.set('slack', slackArray);

                        case 9:
                            _context.next = 11;
                            return settings.save();

                        case 11:
                            return _context.abrupt('return', _context.sent);

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context['catch'](3);

                            if (!_context.t0) {
                                _context.next = 19;
                                break;
                            }

                            this.get('notifications').showAPIError(_context.t0);
                            throw _context.t0;

                        case 19:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[3, 14]]);
        })).drop(),

        sendTestNotification: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var notifications, slackApi;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            notifications = this.get('notifications');
                            slackApi = this.get('ghostPaths.url').api('slack', 'test');
                            _context2.prev = 2;
                            _context2.next = 5;
                            return this.get('save').perform();

                        case 5:
                            _context2.next = 7;
                            return this.get('ajax').post(slackApi);

                        case 7:
                            notifications.showNotification('Check your Slack channel for the test message!', { type: 'info', key: 'slack-test.send.success' });
                            return _context2.abrupt('return', true);

                        case 11:
                            _context2.prev = 11;
                            _context2.t0 = _context2['catch'](2);

                            notifications.showAPIError(_context2.t0, { key: 'slack-test:send' });

                            if ((0, _errors.isInvalidError)(_context2.t0)) {
                                _context2.next = 16;
                                break;
                            }

                            throw _context2.t0;

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[2, 11]]);
        })).drop(),

        actions: {
            save: function save() {
                this.get('save').perform();
            },
            updateURL: function updateURL(value) {
                this.set('model.url', value);
                this.get('model.errors').clear();
            },
            triggerDirtyState: function triggerDirtyState() {
                var slack = this.get('model');
                var slackArray = this.get('slackArray');
                var settings = this.get('settings');

                // Hack to trigger the `isDirty` state on the settings model by setting a new Array
                // for slack rather that replacing the existing one which would still point to the
                // same reference and therfore not setting the model into a dirty state
                slackArray.clear().pushObject(slack);
                settings.set('slack', slackArray);
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
                var slackArray = this.get('slackArray');

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // roll back changes on model props
                settings.rollbackAttributes();
                slackArray.clear();

                return transition.retry();
            }
        }
    });
});