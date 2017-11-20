define('ghost-admin/controllers/settings/labs', ['exports', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _ajax, _emberConcurrency) {
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
    var RSVP = Ember.RSVP;
    var isBlank = Ember.isBlank;
    var isEmberArray = Ember.isArray;
    var run = Ember.run;
    var service = Ember.inject.service;
    var testing = Ember.testing;
    var Promise = RSVP.Promise;
    exports.default = Controller.extend({
        importErrors: null,
        importSuccessful: false,
        showDeleteAllModal: false,
        submitting: false,
        uploadButtonText: 'Import',

        importMimeType: ['application/json', 'application/zip', 'application/x-zip-compressed'],
        jsonExtension: ['json'],
        jsonMimeType: ['application/json'],

        ajax: service(),
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),
        settings: service(),

        // TODO: convert to ember-concurrency task
        _validate: function _validate(file) {
            // Windows doesn't have mime-types for json files by default, so we
            // need to have some additional checking
            if (file.type === '') {
                // First check file extension so we can early return
                var _$exec = /(?:\.([^.]+))?$/.exec(file.name),
                    _$exec2 = _slicedToArray(_$exec, 2),
                    extension = _$exec2[1];

                if (!extension || extension.toLowerCase() !== 'json') {
                    return RSVP.reject(new _ajax.UnsupportedMediaTypeError());
                }

                return new Promise(function (resolve, reject) {
                    // Extension is correct, so check the contents of the file
                    var reader = new FileReader();

                    reader.onload = function () {
                        var result = reader.result;


                        try {
                            JSON.parse(result);

                            return resolve();
                        } catch (e) {
                            return reject(new _ajax.UnsupportedMediaTypeError());
                        }
                    };

                    reader.readAsText(file);
                });
            }

            var accept = this.get('importMimeType');

            if (!isBlank(accept) && file && accept.indexOf(file.type) === -1) {
                return RSVP.reject(new _ajax.UnsupportedMediaTypeError());
            }

            return RSVP.resolve();
        },


        sendTestEmail: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var notifications, emailUrl;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            notifications = this.get('notifications');
                            emailUrl = this.get('ghostPaths.url').api('mail', 'test');
                            _context.prev = 2;
                            _context.next = 5;
                            return this.get('ajax').post(emailUrl);

                        case 5:
                            notifications.showAlert('Check your email for the test message.', { type: 'info', key: 'test-email.send.success' });
                            return _context.abrupt('return', true);

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](2);

                            notifications.showAPIError(_context.t0, { key: 'test-email:send' });

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 9]]);
        })).drop(),

        redirectUploadResult: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(success) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            this.set('redirectSuccess', success);
                            this.set('redirectFailure', !success);

                            _context2.next = 4;
                            return (0, _emberConcurrency.timeout)(testing ? 100 : 5000);

                        case 4:

                            this.set('redirectSuccess', null);
                            this.set('redirectFailure', null);
                            return _context2.abrupt('return', true);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })).drop(),

        reset: function reset() {
            this.set('importErrors', null);
            this.set('importSuccessful', false);
        },


        actions: {
            onUpload: function onUpload(file) {
                var _this = this;

                var formData = new FormData();
                var notifications = this.get('notifications');
                var currentUserId = this.get('session.user.id');
                var dbUrl = this.get('ghostPaths.url').api('db');

                this.set('uploadButtonText', 'Importing');
                this.set('importErrors', null);
                this.set('importSuccessful', false);

                return this._validate(file).then(function () {
                    formData.append('importfile', file);

                    return _this.get('ajax').post(dbUrl, {
                        data: formData,
                        dataType: 'json',
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }).then(function (response) {
                    var store = _this.get('store');

                    _this.set('importSuccessful', true);

                    if (response.problems) {
                        _this.set('importErrors', response.problems);
                    }

                    // Clear the store, so that all the new data gets fetched correctly.
                    store.unloadAll();

                    // NOTE: workaround for behaviour change in Ember 2.13
                    // store.unloadAll has some async tendencies so we need to schedule
                    // the reload of the current user once the unload has finished
                    // https://github.com/emberjs/data/issues/4963
                    run.schedule('destroy', _this, function () {
                        // Reload currentUser and set session
                        _this.set('session.user', store.findRecord('user', currentUserId));

                        // TODO: keep as notification, add link to view content
                        notifications.showNotification('Import successful.', { key: 'import.upload.success' });

                        // reload settings
                        return _this.get('settings').reload().then(function (settings) {
                            _this.get('config').set('blogTitle', settings.get('title'));
                        });
                    });
                }).catch(function (response) {
                    if ((0, _ajax.isUnsupportedMediaTypeError)(response) || (0, _ajax.isRequestEntityTooLargeError)(response)) {
                        return _this.set('importErrors', [response]);
                    }

                    if (response && response.payload.errors && isEmberArray(response.payload.errors)) {
                        return _this.set('importErrors', response.payload.errors);
                    }

                    throw response;
                }).finally(function () {
                    _this.set('uploadButtonText', 'Import');
                });
            },
            downloadFile: function downloadFile(url) {
                var dbUrl = this.get('ghostPaths.url').api(url);
                var accessToken = this.get('session.data.authenticated.access_token');
                var downloadURL = dbUrl + '?access_token=' + accessToken;
                var iframe = $('#iframeDownload');

                if (iframe.length === 0) {
                    iframe = $('<iframe>', { id: 'iframeDownload' }).hide().appendTo('body');
                }

                iframe.attr('src', downloadURL);
            },
            toggleDeleteAllModal: function toggleDeleteAllModal() {
                this.toggleProperty('showDeleteAllModal');
            },


            /**
             * Opens a file selection dialog - Triggered by "Upload x" buttons,
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
            }
        }
    });
});