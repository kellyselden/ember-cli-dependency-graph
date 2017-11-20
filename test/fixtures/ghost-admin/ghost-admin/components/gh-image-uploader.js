define('ghost-admin/components/gh-image-uploader', ['exports', 'ghost-admin/utils/ghost-paths', 'ghost-admin/services/ajax', 'ember-invoke-action'], function (exports, _ghostPaths, _ajax, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.IMAGE_EXTENSIONS = exports.IMAGE_MIME_TYPES = undefined;

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
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var isBlank = Ember.isBlank;
    var isEmberArray = Ember.isArray;
    var run = Ember.run;
    var service = Ember.inject.service;
    var IMAGE_MIME_TYPES = exports.IMAGE_MIME_TYPES = 'image/gif,image/jpg,image/jpeg,image/png,image/svg+xml';
    var IMAGE_EXTENSIONS = exports.IMAGE_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

    exports.default = Component.extend({
        ajax: service(),
        config: service(),
        notifications: service(),
        settings: service(),

        tagName: 'section',
        classNames: ['gh-image-uploader'],
        classNameBindings: ['dragClass'],

        image: null,
        text: '',
        altText: '',
        saveButton: true,
        accept: null,
        extensions: null,
        uploadUrl: null,
        validate: null,
        allowUnsplash: false,

        dragClass: null,
        failureMessage: null,
        file: null,
        url: null,
        uploadPercentage: 0,

        _defaultAccept: IMAGE_MIME_TYPES,
        _defaultExtensions: IMAGE_EXTENSIONS,
        _defaultUploadUrl: '/uploads/',
        _showUnsplash: false,

        // TODO: this wouldn't be necessary if the server could accept direct
        // file uploads
        formData: computed('file', function () {
            var file = this.get('file');
            var formData = new FormData();

            formData.append('uploadimage', file);

            return formData;
        }),

        description: computed('text', 'altText', function () {
            var altText = this.get('altText');

            return this.get('text') || (altText ? 'Upload image of "' + altText + '"' : 'Upload an image');
        }),

        progressStyle: computed('uploadPercentage', function () {
            var percentage = this.get('uploadPercentage');
            var width = '';

            if (percentage > 0) {
                width = percentage + '%';
            } else {
                width = '0';
            }

            return htmlSafe('width: ' + width);
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            var image = this.get('image');
            this.set('url', image);

            if (!this.get('accept')) {
                this.set('accept', this.get('_defaultAccept'));
            }
            if (!this.get('extensions')) {
                this.set('extensions', this.get('_defaultExtensions'));
            }
            if (!this.get('uploadUrl')) {
                this.set('uploadUrl', this.get('_defaultUploadUrl'));
            }
        },
        dragOver: function dragOver(event) {
            if (!event.dataTransfer) {
                return;
            }

            // this is needed to work around inconsistencies with dropping files
            // from Chrome's downloads bar
            var eA = event.dataTransfer.effectAllowed;
            event.dataTransfer.dropEffect = eA === 'move' || eA === 'linkMove' ? 'move' : 'copy';

            event.stopPropagation();
            event.preventDefault();

            this.set('dragClass', '-drag-over');
        },
        dragLeave: function dragLeave(event) {
            event.preventDefault();
            this.set('dragClass', null);
        },
        drop: function drop(event) {
            event.preventDefault();

            this.set('dragClass', null);

            if (event.dataTransfer.files) {
                this.send('fileSelected', event.dataTransfer.files);
            }
        },
        _uploadStarted: function _uploadStarted() {
            (0, _emberInvokeAction.invokeAction)(this, 'uploadStarted');
        },
        _uploadProgress: function _uploadProgress(event) {
            var _this = this;

            if (event.lengthComputable) {
                run(function () {
                    var percentage = Math.round(event.loaded / event.total * 100);
                    _this.set('uploadPercentage', percentage);
                });
            }
        },
        _uploadFinished: function _uploadFinished() {
            (0, _emberInvokeAction.invokeAction)(this, 'uploadFinished');
        },
        _uploadSuccess: function _uploadSuccess(response) {
            this.set('url', response);
            this.send('saveUrl');
            this.send('reset');
            (0, _emberInvokeAction.invokeAction)(this, 'uploadSuccess', response);
        },
        _uploadFailed: function _uploadFailed(error) {
            var message = void 0;

            if ((0, _ajax.isVersionMismatchError)(error)) {
                this.get('notifications').showAPIError(error);
            }

            if ((0, _ajax.isUnsupportedMediaTypeError)(error)) {
                var validExtensions = this.get('extensions').join(', .').toUpperCase();
                validExtensions = '.' + validExtensions;

                message = 'The image type you uploaded is not supported. Please use ' + validExtensions;
            } else if ((0, _ajax.isRequestEntityTooLargeError)(error)) {
                message = 'The image you uploaded was larger than the maximum file size your server allows.';
            } else if (error.payload.errors && !isBlank(error.payload.errors[0].message)) {
                message = error.payload.errors[0].message;
            } else {
                message = 'Something went wrong :(';
            }

            this.set('failureMessage', message);
            (0, _emberInvokeAction.invokeAction)(this, 'uploadFailed', error);
        },
        generateRequest: function generateRequest() {
            var _this2 = this;

            var ajax = this.get('ajax');
            var formData = this.get('formData');
            var uploadUrl = this.get('uploadUrl');
            // CASE: we want to upload an icon and we have to POST it to a different endpoint, expecially for icons
            var url = '' + (0, _ghostPaths.default)().apiRoot + uploadUrl;

            this._uploadStarted();

            ajax.post(url, {
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'text',
                xhr: function xhr() {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener('progress', function (event) {
                        _this2._uploadProgress(event);
                    }, false);

                    return xhr;
                }
            }).then(function (response) {
                var url = JSON.parse(response);
                _this2._uploadSuccess(url);
            }).catch(function (error) {
                _this2._uploadFailed(error);
            }).finally(function () {
                _this2._uploadFinished();
            });
        },
        _validate: function _validate(file) {
            if (this.get('validate')) {
                return (0, _emberInvokeAction.invokeAction)(this, 'validate', file);
            } else {
                return this._defaultValidator(file);
            }
        },
        _defaultValidator: function _defaultValidator(file) {
            var extensions = this.get('extensions');

            var _$exec = /(?:\.([^.]+))?$/.exec(file.name),
                _$exec2 = _slicedToArray(_$exec, 2),
                extension = _$exec2[1];

            if (!isEmberArray(extensions)) {
                extensions = extensions.split(',');
            }

            if (!extension || extensions.indexOf(extension.toLowerCase()) === -1) {
                return new _ajax.UnsupportedMediaTypeError();
            }

            return true;
        },


        actions: {
            fileSelected: function fileSelected(fileList) {
                // can't use array destructuring here as FileList is not a strict
                // array and fails in Safari
                // eslint-disable-next-line ember-suave/prefer-destructuring
                var file = fileList[0];
                var validationResult = this._validate(file);

                this.set('file', file);
                (0, _emberInvokeAction.invokeAction)(this, 'fileSelected', file);

                if (validationResult === true) {
                    run.schedule('actions', this, function () {
                        this.generateRequest();
                    });
                } else {
                    this._uploadFailed(validationResult);
                }
            },
            addUnsplashPhoto: function addUnsplashPhoto(photo) {
                this.set('url', photo.urls.regular);
                this.send('saveUrl');
            },
            reset: function reset() {
                this.set('file', null);
                this.set('uploadPercentage', 0);
            },
            saveUrl: function saveUrl() {
                var url = this.get('url');
                (0, _emberInvokeAction.invokeAction)(this, 'update', url);
            }
        }
    });
});