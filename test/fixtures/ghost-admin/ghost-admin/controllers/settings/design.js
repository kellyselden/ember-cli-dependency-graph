define('ghost-admin/controllers/settings/design', ['exports', 'ghost-admin/models/navigation-item', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _navigationItem, _ajax, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Controller = Ember.Controller;
    var RSVP = Ember.RSVP;
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var notEmpty = Ember.computed.notEmpty;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),

        newNavItem: null,

        dirtyAttributes: false,

        themes: null,
        themeToDelete: null,
        showDeleteThemeModal: notEmpty('themeToDelete'),

        blogUrl: computed('config.blogUrl', function () {
            var url = this.get('config.blogUrl');

            return url.slice(-1) !== '/' ? url + '/' : url;
        }),

        init: function init() {
            this._super.apply(this, arguments);
            this.set('newNavItem', _navigationItem.default.create({ isNew: true }));
        },


        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var navItems, newNavItem, notifications, validationPromises;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            navItems = this.get('model.navigation');
                            newNavItem = this.get('newNavItem');
                            notifications = this.get('notifications');
                            validationPromises = [];


                            if (!newNavItem.get('isBlank')) {
                                validationPromises.pushObject(this.send('addNavItem'));
                            }

                            navItems.map(function (item) {
                                validationPromises.pushObject(item.validate());
                            });

                            _context.prev = 6;
                            _context.next = 9;
                            return RSVP.all(validationPromises);

                        case 9:
                            this.set('dirtyAttributes', false);
                            _context.next = 12;
                            return this.get('model').save();

                        case 12:
                            return _context.abrupt('return', _context.sent);

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](6);

                            if (!_context.t0) {
                                _context.next = 20;
                                break;
                            }

                            notifications.showAPIError(_context.t0);
                            throw _context.t0;

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[6, 15]]);
        })),

        addNewNavItem: function addNewNavItem() {
            var navItems = this.get('model.navigation');
            var newNavItem = this.get('newNavItem');

            newNavItem.set('isNew', false);
            navItems.pushObject(newNavItem);
            this.set('dirtyAttributes', true);
            this.set('newNavItem', _navigationItem.default.create({ isNew: true }));
            $('.gh-blognav-line:last input:first').focus();
        },
        _deleteTheme: function _deleteTheme() {
            var _this = this;

            var theme = this.get('store').peekRecord('theme', this.get('themeToDelete').name);

            if (!theme) {
                return;
            }

            return theme.destroyRecord().then(function () {
                // HACK: this is a private method, we need to unload from the store
                // here so that uploading another theme with the same "id" doesn't
                // attempt to update the deleted record
                theme.unloadRecord();
            }).catch(function (error) {
                _this.get('notifications').showAPIError(error);
            });
        },


        actions: {
            save: function save() {
                this.get('save').perform();
            },
            addNavItem: function addNavItem() {
                var _this2 = this;

                var newNavItem = this.get('newNavItem');

                // If the url sent through is blank (user never edited the url)
                if (newNavItem.get('url') === '') {
                    newNavItem.set('url', '/');
                }

                return newNavItem.validate().then(function () {
                    _this2.addNewNavItem();
                });
            },
            deleteNavItem: function deleteNavItem(item) {
                if (!item) {
                    return;
                }

                var navItems = this.get('model.navigation');

                navItems.removeObject(item);
                this.set('dirtyAttributes', true);
            },
            updateLabel: function updateLabel(label, navItem) {
                if (!navItem) {
                    return;
                }

                navItem.set('label', label);
                this.set('dirtyAttributes', true);
            },
            updateUrl: function updateUrl(url, navItem) {
                if (!navItem) {
                    return;
                }

                navItem.set('url', url);
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
                var model = this.get('model');

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // roll back changes on model props
                model.rollbackAttributes();
                this.set('dirtyAttributes', false);

                return transition.retry();
            },
            activateTheme: function activateTheme(theme) {
                var _this3 = this;

                return theme.activate().then(function (theme) {
                    var themeName = theme.get('name');

                    if (!isEmpty(theme.get('warnings'))) {
                        _this3.set('themeWarnings', theme.get('warnings'));
                        _this3.set('showThemeWarningsModal', true);
                    }

                    if (!isEmpty(theme.get('errors'))) {
                        _this3.set('themeErrors', theme.get('errors'));
                        _this3.set('showThemeWarningsModal', true);
                    }

                    if (_this3.get('themeErrors') || _this3.get('themeWarnings')) {
                        var message = themeName + ' activated successfully but some warnings/errors were detected.\n                                   You are still able to use and activate the theme. Here is your report...';
                        _this3.set('message', message);
                    }
                }).catch(function (error) {
                    if ((0, _ajax.isThemeValidationError)(error)) {
                        var errors = error.payload.errors[0].errorDetails;
                        var fatalErrors = [];
                        var normalErrors = [];

                        // to have a proper grouping of fatal errors and none fatal, we need to check
                        // our errors for the fatal property
                        if (errors.length > 0) {
                            for (var i = 0; i < errors.length; i++) {
                                if (errors[i].fatal) {
                                    fatalErrors.push(errors[i]);
                                } else {
                                    normalErrors.push(errors[i]);
                                }
                            }
                        }

                        _this3.set('themeErrors', normalErrors);
                        _this3.set('themeFatalErrors', fatalErrors);
                        _this3.set('showThemeErrorsModal', true);
                        return;
                    }

                    throw error;
                });
            },
            downloadTheme: function downloadTheme(theme) {
                var themeURL = this.get('ghostPaths.apiRoot') + '/themes/' + theme.name;
                var accessToken = this.get('session.data.authenticated.access_token');
                var downloadURL = themeURL + '/download/?access_token=' + accessToken;
                var iframe = $('#iframeDownload');

                if (iframe.length === 0) {
                    iframe = $('<iframe>', { id: 'iframeDownload' }).hide().appendTo('body');
                }

                iframe.attr('src', downloadURL);
            },
            deleteTheme: function deleteTheme(theme) {
                if (theme) {
                    return this.set('themeToDelete', theme);
                }

                return this._deleteTheme();
            },
            hideDeleteThemeModal: function hideDeleteThemeModal() {
                this.set('themeToDelete', null);
            },
            hideThemeWarningsModal: function hideThemeWarningsModal() {
                this.set('themeWarnings', null);
                this.set('themeErrors', null);
                this.set('themeFatalErrors', null);
                this.set('showThemeWarningsModal', false);
                this.set('showThemeErrorsModal', false);
            },
            reset: function reset() {
                this.set('newNavItem', _navigationItem.default.create({ isNew: true }));
            }
        }
    });
});