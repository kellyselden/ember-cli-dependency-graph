define('ghost-admin/mixins/editor-base-controller', ['exports', 'ghost-admin/models/post', 'ghost-admin/utils/bound-one-way', 'ghost-admin/utils/ghost-paths', 'ghost-admin/utils/isNumber', 'moment', 'ember-ajax/errors', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _post, _boundOneWay, _ghostPaths, _isNumber, _moment, _errors, _ajax, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var computed = Ember.computed;
    var controller = Ember.inject.controller;
    var htmlSafe = Ember.String.htmlSafe;
    var isBlank = Ember.isBlank;
    var isEmberArray = Ember.isArray;
    var mapBy = Ember.computed.mapBy;
    var reads = Ember.computed.reads;
    var service = Ember.inject.service;
    var testing = Ember.testing;


    // this array will hold properties we need to watch
    // to know if the model has been changed (`controller.hasDirtyAttributes`)
    var watchedProps = ['model.scratch', 'model.titleScratch', 'model.hasDirtyAttributes', 'model.tags.[]'];

    var DEFAULT_TITLE = '(Untitled)';

    // time in ms to save after last content edit
    var AUTOSAVE_TIMEOUT = 3000;
    // time in ms to force a save if the user is continuously typing
    var TIMEDSAVE_TIMEOUT = 60000;

    _post.default.eachAttribute(function (name) {
        watchedProps.push('model.' + name);
    });

    exports.default = Mixin.create({

        showLeaveEditorModal: false,
        showReAuthenticateModal: false,
        showDeletePostModal: false,
        shouldFocusEditor: true,

        application: controller(),
        notifications: service(),
        clock: service(),
        slugGenerator: service(),
        ui: service(),

        wordcount: 0,
        cards: [], // for apps
        atoms: [], // for apps
        toolbar: [], // for apps
        apiRoot: (0, _ghostPaths.default)().apiRoot,
        assetPath: (0, _ghostPaths.default)().assetRoot,
        editor: null,
        editorMenuIsOpen: false,

        navIsClosed: reads('application.autoNav'),

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);
            window.onbeforeunload = function () {
                return _this.get('hasDirtyAttributes') ? _this.unloadDirtyMessage() : null;
            };
        },


        _canAutosave: computed('model.isDraft', function () {
            return !testing && this.get('model.isDraft');
        }),

        // save 3 seconds after the last edit
        _autosave: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (this.get('_canAutosave')) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return');

                        case 2:
                            if (!this.get('model.isNew')) {
                                _context.next = 4;
                                break;
                            }

                            return _context.abrupt('return', this.get('autosave').perform());

                        case 4:
                            _context.next = 6;
                            return (0, _emberConcurrency.timeout)(AUTOSAVE_TIMEOUT);

                        case 6:
                            this.get('autosave').perform();

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).restartable(),

        // save at 60 seconds even if the user doesn't stop typing
        _timedSave: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (this.get('_canAutosave')) {
                                _context2.next = 2;
                                break;
                            }

                            return _context2.abrupt('return');

                        case 2:
                            if (!(!testing && true)) {
                                _context2.next = 8;
                                break;
                            }

                            _context2.next = 5;
                            return (0, _emberConcurrency.timeout)(TIMEDSAVE_TIMEOUT);

                        case 5:
                            this.get('autosave').perform();
                            _context2.next = 2;
                            break;

                        case 8:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })).drop(),

        // separate task for autosave so that it doesn't override a manual save
        autosave: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (this.get('save.isRunning')) {
                                _context3.next = 4;
                                break;
                            }

                            _context3.next = 3;
                            return this.get('save').perform({
                                silent: true,
                                backgroundSave: true
                            });

                        case 3:
                            return _context3.abrupt('return', _context3.sent);

                        case 4:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })).drop(),

        _autosaveRunning: computed('_autosave.isRunning', '_timedSave.isRunning', function () {
            var autosave = this.get('_autosave.isRunning');
            var timedsave = this.get('_timedSave.isRunning');

            return autosave || timedsave;
        }),

        // updateSlug and save should always be enqueued so that we don't run into
        // problems with concurrency, for example when Cmd-S is pressed whilst the
        // cursor is in the slug field - that would previously trigger a simultaneous
        // slug update and save resulting in ember data errors and inconsistent save
        // results
        saveTasks: (0, _emberConcurrency.taskGroup)().enqueue(),

        // save tasks cancels autosave before running, although this cancels the
        // _xSave tasks  that will also cancel the autosave task
        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var prevStatus, isNew, status, model, errorOrMessages;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            prevStatus = this.get('model.status');
                            isNew = this.get('model.isNew');
                            status = void 0;


                            this.send('cancelAutosave');

                            if (!(options.backgroundSave && !this.get('hasDirtyAttributes'))) {
                                _context4.next = 6;
                                break;
                            }

                            return _context4.abrupt('return');

                        case 6:

                            if (options.backgroundSave) {
                                // do not allow a post's status to be set to published by a background save
                                status = 'draft';
                            } else {
                                if (this.get('post.pastScheduledTime')) {
                                    status = !this.get('willSchedule') && !this.get('willPublish') ? 'draft' : 'published';
                                } else {
                                    if (this.get('willPublish') && !this.get('model.isScheduled') && !this.get('statusFreeze')) {
                                        status = 'published';
                                    } else if (this.get('willSchedule') && !this.get('model.isPublished') && !this.get('statusFreeze')) {
                                        status = 'scheduled';
                                    } else {
                                        status = 'draft';
                                    }
                                }
                            }

                            // Set the properties that are indirected
                            // set mobiledoc equal to what's in the editor, minus the image markers.
                            this.set('model.mobiledoc', this.get('model.scratch'));
                            this.set('model.status', status);

                            // Set a default title
                            if (!this.get('model.titleScratch').trim()) {
                                this.set('model.titleScratch', DEFAULT_TITLE);
                            }

                            this.set('model.title', this.get('model.titleScratch'));
                            this.set('model.customExcerpt', this.get('model.customExcerptScratch'));
                            this.set('model.footerInjection', this.get('model.footerExcerptScratch'));
                            this.set('model.headerInjection', this.get('model.headerExcerptScratch'));
                            this.set('model.metaTitle', this.get('model.metaTitleScratch'));
                            this.set('model.metaDescription', this.get('model.metaDescriptionScratch'));
                            this.set('model.ogTitle', this.get('model.ogTitleScratch'));
                            this.set('model.ogDescription', this.get('model.ogDescriptionScratch'));
                            this.set('model.twitterTitle', this.get('model.twitterTitleScratch'));
                            this.set('model.twitterDescription', this.get('model.twitterDescriptionScratch'));

                            if (this.get('model.slug')) {
                                _context4.next = 24;
                                break;
                            }

                            this.get('saveTitle').cancelAll();

                            _context4.next = 24;
                            return this.get('generateSlug').perform();

                        case 24:
                            _context4.prev = 24;
                            _context4.next = 27;
                            return this.get('model').save(options);

                        case 27:
                            model = _context4.sent;


                            if (!options.silent) {
                                this.showSaveNotification(prevStatus, model.get('status'), isNew ? true : false);
                            }

                            this.get('model').set('statusScratch', null);

                            // redirect to edit route if saving a new record

                            if (!(isNew && model.get('id'))) {
                                _context4.next = 33;
                                break;
                            }

                            if (!this.get('leaveEditorTransition')) {
                                this.replaceRoute('editor.edit', model);
                            }
                            return _context4.abrupt('return', true);

                        case 33:
                            return _context4.abrupt('return', model);

                        case 36:
                            _context4.prev = 36;
                            _context4.t0 = _context4['catch'](24);

                            if (!(_context4.t0 && !(0, _errors.isInvalidError)(_context4.t0))) {
                                _context4.next = 41;
                                break;
                            }

                            this.send('error', _context4.t0);
                            return _context4.abrupt('return');

                        case 41:

                            this.set('model.status', prevStatus);

                            if (options.silent) {
                                _context4.next = 46;
                                break;
                            }

                            errorOrMessages = _context4.t0 || this.get('model.errors.messages');

                            this.showErrorAlert(prevStatus, this.get('model.status'), errorOrMessages);
                            // simulate a validation error for upstream tasks
                            throw undefined;

                        case 46:
                            return _context4.abrupt('return', this.get('model'));

                        case 47:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[24, 36]]);
        })).group('saveTasks'),

        /*
         * triggered by a user manually changing slug
         */
        updateSlug: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_newSlug) {
            var slug, newSlug, serverSlug, slugTokens, check;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            slug = this.get('model.slug');
                            newSlug = void 0, serverSlug = void 0;


                            newSlug = _newSlug || slug;
                            newSlug = newSlug && newSlug.trim();

                            // Ignore unchanged slugs or candidate slugs that are empty

                            if (!(!newSlug || slug === newSlug)) {
                                _context5.next = 7;
                                break;
                            }

                            // reset the input to its previous state
                            this.set('slugValue', slug);
                            return _context5.abrupt('return');

                        case 7:
                            _context5.next = 9;
                            return this.get('slugGenerator').generateSlug('post', newSlug);

                        case 9:
                            serverSlug = _context5.sent;

                            if (!(serverSlug === slug)) {
                                _context5.next = 12;
                                break;
                            }

                            return _context5.abrupt('return');

                        case 12:

                            // Because the server transforms the candidate slug by stripping
                            // certain characters and appending a number onto the end of slugs
                            // to enforce uniqueness, there are cases where we can get back a
                            // candidate slug that is a duplicate of the original except for
                            // the trailing incrementor (e.g., this-is-a-slug and this-is-a-slug-2)

                            // get the last token out of the slug candidate and see if it's a number
                            slugTokens = serverSlug.split('-');
                            check = Number(slugTokens.pop());

                            // if the candidate slug is the same as the existing slug except
                            // for the incrementor then the existing slug should be used

                            if (!((0, _isNumber.default)(check) && check > 0)) {
                                _context5.next = 18;
                                break;
                            }

                            if (!(slug === slugTokens.join('-') && serverSlug !== newSlug)) {
                                _context5.next = 18;
                                break;
                            }

                            this.set('slugValue', slug);

                            return _context5.abrupt('return');

                        case 18:

                            this.set('model.slug', serverSlug);

                            // If this is a new post.  Don't save the model.  Defer the save
                            // to the user pressing the save button

                            if (!this.get('model.isNew')) {
                                _context5.next = 21;
                                break;
                            }

                            return _context5.abrupt('return');

                        case 21:
                            _context5.next = 23;
                            return this.get('model').save();

                        case 23:
                            return _context5.abrupt('return', _context5.sent);

                        case 24:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        })).group('saveTasks'),

        // used in the PSM so that saves are sequential and don't trigger collision
        // detection errors
        savePost: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var status;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            _context6.next = 3;
                            return this.get('model').save();

                        case 3:
                            return _context6.abrupt('return', _context6.sent);

                        case 6:
                            _context6.prev = 6;
                            _context6.t0 = _context6['catch'](0);

                            if (_context6.t0) {
                                status = this.get('model.status');

                                this.showErrorAlert(status, status, _context6.t0);
                            }

                            throw _context6.t0;

                        case 10:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this, [[0, 6]]);
        })).group('saveTasks'),

        /**
         * By default, a post will not change its publish state.
         * Only with a user-set value (via setSaveType action)
         * can the post's status change.
         */
        willPublish: (0, _boundOneWay.default)('model.isPublished'),
        willSchedule: (0, _boundOneWay.default)('model.isScheduled'),

        // set by the editor route and `hasDirtyAttributes`. useful when checking
        // whether the number of tags has changed for `hasDirtyAttributes`.
        previousTagNames: null,

        tagNames: mapBy('model.tags', 'name'),

        postOrPage: computed('model.page', function () {
            return this.get('model.page') ? 'Page' : 'Post';
        }),

        // countdown timer to show the time left until publish time for a scheduled post
        // starts 15 minutes before scheduled time
        scheduleCountdown: computed('model.{publishedAtUTC,isScheduled}', 'clock.second', function () {
            var isScheduled = this.get('model.isScheduled');
            var publishTime = this.get('model.publishedAtUTC') || _moment.default.utc();
            var timeUntilPublished = publishTime.diff(_moment.default.utc(), 'minutes', true);
            var isPublishedSoon = timeUntilPublished > 0 && timeUntilPublished < 15;

            // force a recompute
            this.get('clock.second');

            if (isScheduled && isPublishedSoon) {
                return (0, _moment.default)(publishTime).fromNow();
            } else {
                return false;
            }
        }),

        // compares previousTagNames to tagNames
        tagNamesEqual: function tagNamesEqual() {
            var tagNames = this.get('tagNames') || [];
            var previousTagNames = this.get('previousTagNames') || [];
            var hashCurrent = void 0,
                hashPrevious = void 0;

            // beware! even if they have the same length,
            // that doesn't mean they're the same.
            if (tagNames.length !== previousTagNames.length) {
                return false;
            }

            // instead of comparing with slow, nested for loops,
            // perform join on each array and compare the strings
            hashCurrent = tagNames.join('');
            hashPrevious = previousTagNames.join('');

            return hashCurrent === hashPrevious;
        },


        // a hook created in editor-base-route's setupController
        modelSaved: function modelSaved() {
            var model = this.get('model');

            // safer to updateTags on save in one place
            // rather than in all other places save is called
            model.updateTags();

            // set previousTagNames to current tagNames for hasDirtyAttributes check
            this.set('previousTagNames', this.get('tagNames'));

            // `updateTags` triggers `hasDirtyAttributes => true`.
            // for a saved model it would otherwise be false.

            // if the two "scratch" properties (title and content) match the model, then
            // it's ok to set hasDirtyAttributes to false
            if (model.get('titleScratch') === model.get('title') && JSON.stringify(model.get('scratch')) === JSON.stringify(model.get('mobiledoc'))) {
                this.set('hasDirtyAttributes', false);
            }
        },


        // an ugly hack, but necessary to watch all the model's properties
        // and more, without having to be explicit and do it manually
        hasDirtyAttributes: computed.apply(Ember, watchedProps.concat({
            get: function get() {
                var model = this.get('model');

                if (!model) {
                    return false;
                }

                var mobiledoc = JSON.stringify(model.get('mobiledoc'));
                var scratch = JSON.stringify(model.get('scratch'));
                var title = model.get('title');
                var titleScratch = model.get('titleScratch');
                var changedAttributes = void 0;

                if (!this.tagNamesEqual()) {
                    return true;
                }

                if (titleScratch !== title) {
                    return true;
                }

                // since `scratch` is not model property, we need to check
                // it explicitly against the model's mobiledoc attribute
                if (mobiledoc !== scratch) {
                    return true;
                }

                // if the Adapter failed to save the model isError will be true
                // and we should consider the model still dirty.
                if (model.get('isError')) {
                    return true;
                }

                // models created on the client always return `hasDirtyAttributes: true`,
                // so we need to see which properties have actually changed.
                if (model.get('isNew')) {
                    changedAttributes = Object.keys(model.changedAttributes());

                    if (changedAttributes.length) {
                        return true;
                    }

                    return false;
                }

                // even though we use the `scratch` prop to show edits,
                // which does *not* change the model's `hasDirtyAttributes` property,
                // `hasDirtyAttributes` will tell us if the other props have changed,
                // as long as the model is not new (model.isNew === false).
                return model.get('hasDirtyAttributes');
            },
            set: function set(key, value) {
                return value;
            }
        })),

        // used on window.onbeforeunload
        unloadDirtyMessage: function unloadDirtyMessage() {
            return '==============================\n\n' + 'Hey there! It looks like you\'re in the middle of writing' + ' something and you haven\'t saved all of your content.' + '\n\nSave before you go!\n\n' + '==============================';
        },


        // TODO: This has to be moved to the I18n localization file.
        // This structure is supposed to be close to the i18n-localization which will be used soon.
        messageMap: {
            errors: {
                post: {
                    published: {
                        published: 'Update failed',
                        draft: 'Saving failed',
                        scheduled: 'Scheduling failed'
                    },
                    draft: {
                        published: 'Publish failed',
                        draft: 'Saving failed',
                        scheduled: 'Scheduling failed'
                    },
                    scheduled: {
                        scheduled: 'Updated failed',
                        draft: 'Unscheduling failed',
                        published: 'Publish failed'
                    }

                }
            },

            success: {
                post: {
                    published: {
                        published: 'Updated.',
                        draft: 'Saved.',
                        scheduled: 'Scheduled.'
                    },
                    draft: {
                        published: 'Published!',
                        draft: 'Saved.',
                        scheduled: 'Scheduled.'
                    },
                    scheduled: {
                        scheduled: 'Updated.',
                        draft: 'Unscheduled.',
                        published: 'Published!'
                    }
                }
            }
        },

        // TODO: Update for new notification click-action API
        showSaveNotification: function showSaveNotification(prevStatus, status, delay) {
            var message = this.messageMap.success.post[prevStatus][status];
            var notifications = this.get('notifications');
            var type = void 0,
                path = void 0;

            if (status === 'published') {
                type = this.get('postOrPage');
                path = this.get('model.absoluteUrl');
            } else {
                type = 'Preview';
                path = this.get('model.previewUrl');
            }

            message += '&nbsp;<a href="' + path + '" target="_blank">View ' + type + '</a>';

            notifications.showNotification(message.htmlSafe(), { delayed: delay });
        },
        showErrorAlert: function showErrorAlert(prevStatus, status, error, delay) {
            var message = this.messageMap.errors.post[prevStatus][status];
            var notifications = this.get('notifications');
            var errorMessage = void 0;

            function isString(str) {
                /* global toString */
                return toString.call(str) === '[object String]';
            }

            if (error && isString(error)) {
                errorMessage = error;
            } else if (error && isEmberArray(error)) {
                // This is here because validation errors are returned as an array
                // TODO: remove this once validations are fixed
                errorMessage = error[0];
            } else if (error && error.payload && error.payload.errors && error.payload.errors[0].message) {
                errorMessage = error.payload.errors[0].message;
            } else {
                errorMessage = 'Unknown Error';
            }

            message += ': ' + errorMessage;
            message = htmlSafe(message);

            notifications.showAlert(message, { type: 'error', delayed: delay, key: 'post.save' });
        },


        saveTitle: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var model, currentTitle, newTitle;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            model = this.get('model');
                            currentTitle = model.get('title');
                            newTitle = model.get('titleScratch').trim();

                            if (!(currentTitle && newTitle && newTitle === currentTitle)) {
                                _context7.next = 5;
                                break;
                            }

                            return _context7.abrupt('return');

                        case 5:

                            // this is necessary to force a save when the title is blank
                            this.set('hasDirtyAttributes', true);

                            // generate a slug if a post is new and doesn't have a title yet or
                            // if the title is still '(Untitled)'

                            if (!(model.get('isNew') && !currentTitle || currentTitle === DEFAULT_TITLE)) {
                                _context7.next = 9;
                                break;
                            }

                            _context7.next = 9;
                            return this.get('generateSlug').perform();

                        case 9:
                            if (!this.get('model.isDraft')) {
                                _context7.next = 12;
                                break;
                            }

                            _context7.next = 12;
                            return this.get('autosave').perform();

                        case 12:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        })),

        generateSlug: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var title, slug;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            title = this.get('model.titleScratch');

                            // Only set an "untitled" slug once per post

                            if (!(title === DEFAULT_TITLE && this.get('model.slug'))) {
                                _context8.next = 3;
                                break;
                            }

                            return _context8.abrupt('return');

                        case 3:
                            _context8.prev = 3;
                            _context8.next = 6;
                            return this.get('slugGenerator').generateSlug('post', title);

                        case 6:
                            slug = _context8.sent;


                            if (!isBlank(slug)) {
                                this.set('model.slug', slug);
                            }
                            _context8.next = 13;
                            break;

                        case 10:
                            _context8.prev = 10;
                            _context8.t0 = _context8['catch'](3);

                            // Nothing to do (would be nice to log this somewhere though),
                            // but a rejected promise needs to be handled here so that a resolved
                            // promise is returned.
                            if ((0, _ajax.isVersionMismatchError)(_context8.t0)) {
                                this.get('notifications').showAPIError(_context8.t0);
                            }

                        case 13:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this, [[3, 10]]);
        })).enqueue(),

        actions: {
            updateScratch: function updateScratch(value) {
                this.set('model.scratch', value);

                // save 3 seconds after last edit
                this.get('_autosave').perform();
                // force save at 60 seconds
                this.get('_timedSave').perform();
            },
            cancelAutosave: function cancelAutosave() {
                this.get('_autosave').cancelAll();
                this.get('_timedSave').cancelAll();
            },
            save: function save(options) {
                return this.get('save').perform(options);
            },
            setSaveType: function setSaveType(newType) {
                if (newType === 'publish') {
                    this.set('willPublish', true);
                    this.set('willSchedule', false);
                } else if (newType === 'draft') {
                    this.set('willPublish', false);
                    this.set('willSchedule', false);
                } else if (newType === 'schedule') {
                    this.set('willSchedule', true);
                    this.set('willPublish', false);
                }
            },
            toggleLeaveEditorModal: function toggleLeaveEditorModal(transition) {
                var leaveTransition = this.get('leaveEditorTransition');

                if (!transition && this.get('showLeaveEditorModal')) {
                    this.set('leaveEditorTransition', null);
                    this.set('showLeaveEditorModal', false);
                    return;
                }

                if (!leaveTransition || transition.targetName === leaveTransition.targetName) {
                    this.set('leaveEditorTransition', transition);

                    // if a save is running, wait for it to finish then transition
                    if (this.get('saveTasks.isRunning')) {
                        return this.get('saveTasks.last').then(function () {
                            transition.retry();
                        });
                    }

                    // if an autosave is scheduled, cancel it, save then transition
                    if (this.get('_autosaveRunning')) {
                        this.send('cancelAutosave');
                        this.get('autosave').cancelAll();

                        return this.get('autosave').perform().then(function () {
                            transition.retry();
                        });
                    }

                    // we genuinely have unsaved data, show the modal
                    this.set('showLeaveEditorModal', true);
                }
            },
            leaveEditor: function leaveEditor() {
                var transition = this.get('leaveEditorTransition');
                var model = this.get('model');

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // definitely want to clear the data store and post of any unsaved, client-generated tags
                model.updateTags();

                if (model.get('isNew')) {
                    // the user doesn't want to save the new, unsaved post, so delete it.
                    model.deleteRecord();
                } else {
                    // roll back changes on model props
                    model.rollbackAttributes();
                }

                // setting hasDirtyAttributes to false here allows willTransition on the editor route to succeed
                this.set('hasDirtyAttributes', false);

                // since the transition is now certain to complete, we can unset window.onbeforeunload here
                window.onbeforeunload = null;

                return transition.retry();
            },
            updateTitle: function updateTitle(newTitle) {
                this.set('model.titleScratch', newTitle);
            },
            toggleDeletePostModal: function toggleDeletePostModal() {
                if (!this.get('model.isNew')) {
                    this.toggleProperty('showDeletePostModal');
                }
            },
            toggleReAuthenticateModal: function toggleReAuthenticateModal() {
                this.toggleProperty('showReAuthenticateModal');
            },
            setWordcount: function setWordcount(wordcount) {
                this.set('wordcount', wordcount);
            }
        }
    });
});