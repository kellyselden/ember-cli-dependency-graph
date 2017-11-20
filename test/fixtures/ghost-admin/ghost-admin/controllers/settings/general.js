define('ghost-admin/controllers/settings/general', ['exports', 'ghost-admin/utils/random-password', 'ghost-admin/components/gh-image-uploader', 'ember-concurrency'], function (exports, _randomPassword, _ghImageUploader, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var $ = Ember.$;
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    var observer = Ember.observer;
    var run = Ember.run;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),

        availableTimezones: null,
        iconExtensions: ['ico', 'png'],
        iconMimeTypes: 'image/png,image/x-icon',
        imageExtensions: _ghImageUploader.IMAGE_EXTENSIONS,
        imageMimeTypes: _ghImageUploader.IMAGE_MIME_TYPES,

        _scratchFacebook: null,
        _scratchTwitter: null,

        isDatedPermalinks: computed('model.permalinks', {
            set: function set(key, value) {
                this.set('model.permalinks', value ? '/:year/:month/:day/:slug/' : '/:slug/');

                var slugForm = this.get('model.permalinks');
                return slugForm !== '/:slug/';
            },
            get: function get() {
                var slugForm = this.get('model.permalinks');

                return slugForm !== '/:slug/';
            }
        }),

        generatePassword: observer('model.isPrivate', function () {
            this.get('model.errors').remove('password');
            if (this.get('model.isPrivate') && this.get('model.hasDirtyAttributes')) {
                this.get('model').set('password', (0, _randomPassword.default)());
            }
        }),

        privateRSSUrl: computed('config.blogUrl', 'model.publicHash', function () {
            var blogUrl = this.get('config.blogUrl');
            var publicHash = this.get('model.publicHash');

            return blogUrl + '/' + publicHash + '/rss';
        }),

        _deleteTheme: function _deleteTheme() {
            var _this = this;

            var theme = this.get('store').peekRecord('theme', this.get('themeToDelete').name);

            if (!theme) {
                return;
            }

            return theme.destroyRecord().catch(function (error) {
                _this.get('notifications').showAPIError(error);
            });
        },


        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var notifications, config, model;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            notifications = this.get('notifications');
                            config = this.get('config');
                            _context.prev = 2;
                            _context.next = 5;
                            return this.get('model').save();

                        case 5:
                            model = _context.sent;

                            config.set('blogTitle', model.get('title'));

                            // this forces the document title to recompute after
                            // a blog title change
                            this.send('collectTitleTokens', []);

                            return _context.abrupt('return', model);

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](2);

                            if (_context.t0) {
                                notifications.showAPIError(_context.t0, { key: 'settings.save' });
                            }
                            throw _context.t0;

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 11]]);
        })),

        actions: {
            save: function save() {
                this.get('save').perform();
            },
            setTimezone: function setTimezone(timezone) {
                this.set('model.activeTimezone', timezone.name);
            },
            removeImage: function removeImage(image) {
                // setting `null` here will error as the server treats it as "null"
                this.get('model').set(image, '');
            },


            /**
             * Opens a file selection dialog - Triggered by "Upload Image" buttons,
             * searches for the hidden file input within the .gh-setting element
             * containing the clicked button then simulates a click
             * @param  {MouseEvent} event - MouseEvent fired by the button click
             */
            triggerFileDialog: function triggerFileDialog(event) {
                var fileInput = $(event.target).closest('.gh-setting').find('input[type="file"]');

                if (fileInput.length > 0) {
                    // reset file input value before clicking so that the same image
                    // can be selected again
                    fileInput.val('');

                    // simulate click to open file dialog
                    // using jQuery because IE11 doesn't support MouseEvent
                    $(fileInput).click();
                }
            },


            /**
             * Fired after an image upload completes
             * @param  {string} property - Property name to be set on `this.model`
             * @param  {UploadResult[]} results - Array of UploadResult objects
             * @return {string} The URL that was set on `this.model.property`
             */
            imageUploaded: function imageUploaded(property, results) {
                if (results[0]) {
                    // Note: We have to reset the file input after upload, otherwise you can't upload the same image again
                    // See https://github.com/thefrontside/emberx-file-input/blob/master/addon/components/x-file-input.js#L37
                    // See https://github.com/TryGhost/Ghost/issues/8545
                    $('.x-file--input').val('');
                    return this.get('model').set(property, results[0].url);
                }
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

                return transition.retry();
            },
            validateFacebookUrl: function validateFacebookUrl() {
                var newUrl = this.get('_scratchFacebook');
                var oldUrl = this.get('model.facebook');
                var errMessage = '';

                // reset errors and validation
                this.get('model.errors').remove('facebook');
                this.get('model.hasValidated').removeObject('facebook');

                if (newUrl === '') {
                    // Clear out the Facebook url
                    this.set('model.facebook', '');
                    return;
                }

                // _scratchFacebook will be null unless the user has input something
                if (!newUrl) {
                    newUrl = oldUrl;
                }

                try {
                    // strip any facebook URLs out
                    newUrl = newUrl.replace(/(https?:\/\/)?(www\.)?facebook\.com/i, '');

                    // don't allow any non-facebook urls
                    if (newUrl.match(/^(http|\/\/)/i)) {
                        throw 'invalid url';
                    }

                    // strip leading / if we have one then concat to full facebook URL
                    newUrl = newUrl.replace(/^\//, '');
                    newUrl = 'https://www.facebook.com/' + newUrl;

                    // don't allow URL if it's not valid
                    if (!validator.isURL(newUrl)) {
                        throw 'invalid url';
                    }

                    this.set('model.facebook', '');
                    run.schedule('afterRender', this, function () {
                        this.set('model.facebook', newUrl);
                    });
                } catch (e) {
                    if (e === 'invalid url') {
                        errMessage = 'The URL must be in a format like ' + 'https://www.facebook.com/yourPage';
                        this.get('model.errors').add('facebook', errMessage);
                        return;
                    }

                    throw e;
                } finally {
                    this.get('model.hasValidated').pushObject('facebook');
                }
            },
            validateTwitterUrl: function validateTwitterUrl() {
                var newUrl = this.get('_scratchTwitter');
                var oldUrl = this.get('model.twitter');
                var errMessage = '';

                // reset errors and validation
                this.get('model.errors').remove('twitter');
                this.get('model.hasValidated').removeObject('twitter');

                if (newUrl === '') {
                    // Clear out the Twitter url
                    this.set('model.twitter', '');
                    return;
                }

                // _scratchTwitter will be null unless the user has input something
                if (!newUrl) {
                    newUrl = oldUrl;
                }

                if (newUrl.match(/(?:twitter\.com\/)(\S+)/) || newUrl.match(/([a-z\d.]+)/i)) {
                    var username = [];

                    if (newUrl.match(/(?:twitter\.com\/)(\S+)/)) {
                        var _newUrl$match = newUrl.match(/(?:twitter\.com\/)(\S+)/);

                        var _newUrl$match2 = _slicedToArray(_newUrl$match, 2);

                        username = _newUrl$match2[1];
                    } else {
                        var _newUrl$match3 = newUrl.match(/([^/]+)\/?$/mi);

                        var _newUrl$match4 = _slicedToArray(_newUrl$match3, 1);

                        username = _newUrl$match4[0];
                    }

                    // check if username starts with http or www and show error if so
                    if (username.match(/^(http|www)|(\/)/) || !username.match(/^[a-z\d._]{1,15}$/mi)) {
                        errMessage = !username.match(/^[a-z\d._]{1,15}$/mi) ? 'Your Username is not a valid Twitter Username' : 'The URL must be in a format like https://twitter.com/yourUsername';

                        this.get('model.errors').add('twitter', errMessage);
                        this.get('model.hasValidated').pushObject('twitter');
                        return;
                    }

                    newUrl = 'https://twitter.com/' + username;

                    this.get('model.hasValidated').pushObject('twitter');

                    this.set('model.twitter', '');
                    run.schedule('afterRender', this, function () {
                        this.set('model.twitter', newUrl);
                    });
                } else {
                    errMessage = 'The URL must be in a format like ' + 'https://twitter.com/yourUsername';
                    this.get('model.errors').add('twitter', errMessage);
                    this.get('model.hasValidated').pushObject('twitter');
                    return;
                }
            }
        }
    });
});