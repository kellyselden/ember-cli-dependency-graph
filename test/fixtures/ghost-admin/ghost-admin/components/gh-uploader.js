define('ghost-admin/components/gh-uploader', ['exports', 'ghost-admin/utils/ghost-paths', 'ember-concurrency'], function (exports, _ghostPaths, _emberConcurrency) {
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

    var Component = Ember.Component;
    var EmberObject = Ember.Object;
    var isEmberArray = Ember.isArray;
    var isEmpty = Ember.isEmpty;
    var run = Ember.run;
    var service = Ember.inject.service;


    // TODO: this is designed to be a more re-usable/composable upload component, it
    // should be able to replace the duplicated upload logic in:
    // - gh-image-uploader
    // - gh-file-uploader
    // - gh-koenig/cards/card-image
    // - gh-koenig/cards/card-markdown
    //
    // In order to support the above components we'll need to introduce an
    // "allowMultiple" attribute so that single-image uploads don't allow multiple
    // simultaneous uploads

    var MAX_SIMULTANEOUS_UPLOADS = 2;

    /**
     * Result from a file upload
     * @typedef {Object} UploadResult
     * @property {string} fileName - file name, eg "my-image.png"
     * @property {string} url - url relative to Ghost root,eg "/content/images/2017/05/my-image.png"
     */

    var UploadTracker = EmberObject.extend({
        file: null,
        total: 0,
        loaded: 0,

        init: function init() {
            this.total = this.file && this.file.size || 0;
        },
        update: function update(_ref) {
            var loaded = _ref.loaded,
                total = _ref.total;

            this.total = total;
            this.loaded = loaded;
        }
    });

    exports.default = Component.extend({
        tagName: '',

        ajax: service(),

        // Public attributes
        accept: '',
        extensions: '',
        files: null,
        paramName: 'uploadimage', // TODO: is this the best default?
        uploadUrl: null,

        // Interal attributes
        errors: null, // [{fileName: 'x', message: 'y'}, ...]
        totalSize: 0,
        uploadedSize: 0,
        uploadPercentage: 0,
        uploadUrls: null, // [{filename: 'x', url: 'y'}],

        // Private
        _defaultUploadUrl: '/uploads/',
        _files: null,
        _uploadTrackers: null,

        // Closure actions
        onCancel: function onCancel() {},
        onComplete: function onComplete() {},
        onFailed: function onFailed() {},
        onStart: function onStart() {},
        onUploadFailure: function onUploadFailure() {},
        onUploadSuccess: function onUploadSuccess() {},


        // Optional closure actions
        // validate(file) {}

        init: function init() {
            this._super.apply(this, arguments);
            this.set('errors', []);
            this.set('uploadUrls', []);
            this._uploadTrackers = [];
        },
        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            // set up any defaults
            if (!this.get('uploadUrl')) {
                this.set('uploadUrl', this._defaultUploadUrl);
            }

            // if we have new files, validate and start an upload
            var files = this.get('files');
            if (files && files !== this._files) {
                if (this.get('_uploadFiles.isRunning')) {
                    // eslint-disable-next-line
                    console.error('Adding new files whilst an upload is in progress is not supported.');
                }

                this._files = files;

                // we cancel early if any file fails client-side validation
                if (this._validate()) {
                    this.get('_uploadFiles').perform(files);
                }
            }
        },
        _validate: function _validate() {
            var files = this.get('files');
            var validate = this.get('validate') || this._defaultValidator.bind(this);
            var ok = [];
            var errors = [];

            // NOTE: for...of loop results in a transpilation that errors in Edge,
            // once we drop IE11 support we should be able to use native for...of
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var result = validate(file);
                if (result === true) {
                    ok.push(file);
                } else {
                    errors.push({ fileName: file.name, message: result });
                }
            }

            if (isEmpty(errors)) {
                return true;
            }

            this.set('errors', errors);
            this.onFailed(errors);
            return false;
        },


        // we only check the file extension by default because IE doesn't always
        // expose the mime-type, we'll rely on the API for final validation
        _defaultValidator: function _defaultValidator(file) {
            var extensions = this.get('extensions');

            var _$exec = /(?:\.([^.]+))?$/.exec(file.name),
                _$exec2 = _slicedToArray(_$exec, 2),
                extension = _$exec2[1];

            // if extensions is falsy exit early and accept all files


            if (!extensions) {
                return true;
            }

            if (!isEmberArray(extensions)) {
                extensions = extensions.split(',');
            }

            if (!extension || extensions.indexOf(extension.toLowerCase()) === -1) {
                var validExtensions = '.' + extensions.join(', .').toUpperCase();
                return 'The image type you uploaded is not supported. Please use ' + validExtensions;
            }

            return true;
        },


        _uploadFiles: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(files) {
            var uploads, i, file, tracker;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            uploads = [];


                            this._reset();
                            this.onStart();

                            // NOTE: for...of loop results in a transpilation that errors in Edge,
                            // once we drop IE11 support we should be able to use native for...of
                            for (i = 0; i < files.length; i++) {
                                file = files[i];
                                tracker = new UploadTracker({ file: file });


                                this.get('_uploadTrackers').pushObject(tracker);
                                uploads.push(this.get('_uploadFile').perform(tracker, file, i));
                            }

                            // populates this.errors and this.uploadUrls
                            _context.next = 6;
                            return (0, _emberConcurrency.all)(uploads);

                        case 6:

                            if (!isEmpty(this.get('errors'))) {
                                this.onFailed(this.get('errors'));
                            }

                            this.onComplete(this.get('uploadUrls'));

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).drop(),

        _uploadFile: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(tracker, file, index) {
            var _this = this;

            var ajax, formData, url, response, uploadUrl, result, message, _result;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            ajax = this.get('ajax');
                            formData = this._getFormData(file);
                            url = '' + (0, _ghostPaths.default)().apiRoot + this.get('uploadUrl');
                            _context2.prev = 3;
                            _context2.next = 6;
                            return ajax.post(url, {
                                data: formData,
                                processData: false,
                                contentType: false,
                                dataType: 'text',
                                xhr: function xhr() {
                                    var xhr = new window.XMLHttpRequest();

                                    xhr.upload.addEventListener('progress', function (event) {
                                        run(function () {
                                            tracker.update(event);
                                            _this._updateProgress();
                                        });
                                    }, false);

                                    return xhr;
                                }
                            });

                        case 6:
                            response = _context2.sent;


                            // force tracker progress to 100% in case we didn't get a final event,
                            // eg. when using mirage
                            tracker.update({ loaded: file.size, total: file.size });
                            this._updateProgress();

                            // TODO: is it safe to assume we'll only get a url back?
                            uploadUrl = JSON.parse(response);
                            result = {
                                fileName: file.name,
                                url: uploadUrl
                            };


                            this.get('uploadUrls')[index] = result;
                            this.onUploadSuccess(result);

                            return _context2.abrupt('return', true);

                        case 16:
                            _context2.prev = 16;
                            _context2.t0 = _context2['catch'](3);

                            // grab custom error message if present
                            message = _context2.t0.payload.errors && _context2.t0.payload.errors[0].message;

                            // fall back to EmberData/ember-ajax default message for error type

                            if (!message) {
                                message = _context2.t0.message;
                            }

                            _result = {
                                fileName: file.name,
                                message: _context2.t0.payload.errors[0].message
                            };

                            // TODO: check for or expose known error types?

                            this.get('errors').pushObject(_result);
                            this.onUploadFailure(_result);

                        case 23:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[3, 16]]);
        })).maxConcurrency(MAX_SIMULTANEOUS_UPLOADS).enqueue(),

        // NOTE: this is necessary because the API doesn't accept direct file uploads
        _getFormData: function _getFormData(file) {
            var formData = new FormData();
            formData.append(this.get('paramName'), file, file.name);
            return formData;
        },


        // TODO: this was needed because using CPs directly resulted in infrequent updates
        // - I think this was because updates were being wrapped up to save
        // computation but that hypothesis needs testing
        _updateProgress: function _updateProgress() {
            var trackers = this._uploadTrackers;

            var totalSize = trackers.reduce(function (total, tracker) {
                return total + tracker.get('total');
            }, 0);

            var uploadedSize = trackers.reduce(function (total, tracker) {
                return total + tracker.get('loaded');
            }, 0);

            this.set('totalSize', totalSize);
            this.set('uploadedSize', uploadedSize);

            if (totalSize === 0 || uploadedSize === 0) {
                return;
            }

            var uploadPercentage = Math.round(uploadedSize / totalSize * 100);
            this.set('uploadPercentage', uploadPercentage);
        },
        _reset: function _reset() {
            this.set('errors', []);
            this.set('totalSize', 0);
            this.set('uploadedSize', 0);
            this.set('uploadPercentage', 0);
            this.set('uploadUrls', []);
            this._uploadTrackers = [];
        },


        actions: {
            cancel: function cancel() {
                this._reset();
                this.onCancel();
            }
        }
    });
});