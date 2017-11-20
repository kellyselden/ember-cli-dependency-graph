define('ghost-admin/components/modal-upload-theme', ['exports', 'ghost-admin/components/modal-base', 'ghost-admin/utils/ghost-paths', 'ghost-admin/services/ajax', 'ember-invoke-action'], function (exports, _modalBase, _ghostPaths, _ajax, _emberInvokeAction) {
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

    var computed = Ember.computed;
    var get = Ember.get;
    var mapBy = Ember.computed.mapBy;
    var or = Ember.computed.or;
    var run = Ember.run;
    var service = Ember.inject.service;
    exports.default = _modalBase.default.extend({

        accept: ['application/zip', 'application/x-zip-compressed'],
        extensions: ['zip'],
        themes: null,
        closeDisabled: false,
        file: null,
        theme: false,
        displayOverwriteWarning: false,

        eventBus: service(),
        store: service(),

        hideUploader: or('theme', 'displayOverwriteWarning'),

        uploadUrl: computed(function () {
            return (0, _ghostPaths.default)().apiRoot + '/themes/upload/';
        }),

        themeName: computed('theme.{name,package.name}', function () {
            var themePackage = this.get('theme.package');
            var name = this.get('theme.name');

            return themePackage ? themePackage.name + ' - ' + themePackage.version : name;
        }),

        currentThemeNames: mapBy('model.themes', 'name'),

        fileThemeName: computed('file', function () {
            var file = this.get('file');
            return file.name.replace(/\.zip$/, '');
        }),

        canActivateTheme: computed('theme', function () {
            var theme = this.get('theme');
            return theme && !theme.get('active');
        }),

        actions: {
            validateTheme: function validateTheme(file) {
                var themeName = file.name.replace(/\.zip$/, '').replace(/[^\w@.]/gi, '-').toLowerCase();

                var currentThemeNames = this.get('currentThemeNames');

                this.set('file', file);

                var _$exec = /(?:\.([^.]+))?$/.exec(file.name),
                    _$exec2 = _slicedToArray(_$exec, 2),
                    extension = _$exec2[1];

                var extensions = this.get('extensions');

                if (!extension || extensions.indexOf(extension.toLowerCase()) === -1) {
                    return new _ajax.UnsupportedMediaTypeError();
                }

                if (file.name.match(/^casper\.zip$/i)) {
                    return { payload: { errors: [{ message: 'Sorry, the default Casper theme cannot be overwritten.<br>Please rename your zip file and try again.' }] } };
                }

                if (!this._allowOverwrite && currentThemeNames.includes(themeName)) {
                    this.set('displayOverwriteWarning', true);
                    return false;
                }

                return true;
            },
            confirmOverwrite: function confirmOverwrite() {
                this._allowOverwrite = true;
                this.set('displayOverwriteWarning', false);

                // we need to schedule afterRender so that the upload component is
                // displayed again in order to subscribe/respond to the event bus
                run.schedule('afterRender', this, function () {
                    this.get('eventBus').publish('themeUploader:upload', this.get('file'));
                });
            },
            uploadStarted: function uploadStarted() {
                this.set('closeDisabled', true);
            },
            uploadFinished: function uploadFinished() {
                this.set('closeDisabled', false);
            },
            uploadSuccess: function uploadSuccess(response) {
                this.get('store').pushPayload(response);

                var theme = this.get('store').peekRecord('theme', response.themes[0].name);

                this.set('theme', theme);

                if (get(theme, 'warnings.length') > 0) {
                    this.set('validationWarnings', get(theme, 'warnings'));
                }

                // Ghost differentiates between errors and fatal errors
                // You can't activate a theme with fatal errors, but with errors.
                if (get(theme, 'errors.length') > 0) {
                    this.set('validationErrors', get(theme, 'errors'));
                }

                this.set('hasWarningsOrErrors', this.get('validationErrors.length') || this.get('validationWarnings.length'));

                // invoke the passed in confirm action
                (0, _emberInvokeAction.invokeAction)(this, 'model.uploadSuccess', theme);
            },
            uploadFailed: function uploadFailed(error) {
                if ((0, _ajax.isThemeValidationError)(error)) {
                    var errors = error.payload.errors[0].errorDetails;
                    var fatalErrors = [];
                    var normalErrors = [];

                    // to have a proper grouping of fatal errors and none fatal, we need to check
                    // our errors for the fatal property
                    if (errors && errors.length > 0) {
                        for (var i = 0; i < errors.length; i++) {
                            if (errors[i].fatal) {
                                fatalErrors.push(errors[i]);
                            } else {
                                normalErrors.push(errors[i]);
                            }
                        }
                    }

                    this.set('fatalValidationErrors', fatalErrors);
                    this.set('validationErrors', normalErrors);
                }
            },
            confirm: function confirm() {
                // noop - we don't want the enter key doing anything
            },
            activate: function activate() {
                (0, _emberInvokeAction.invokeAction)(this, 'model.activate', this.get('theme'));
                (0, _emberInvokeAction.invokeAction)(this, 'closeModal');
            },
            closeModal: function closeModal() {
                if (!this.get('closeDisabled')) {
                    this._super.apply(this, arguments);
                }
            },
            reset: function reset() {
                this.set('validationWarnings', []);
                this.set('validationErrors', []);
                this.set('fatalValidationErrors', []);
                this.set('hasWarningsOrErrors', false);
            }
        }
    });
});