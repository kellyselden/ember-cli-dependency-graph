define('ghost-admin/services/ajax', ['exports', 'ember-ajax/services/ajax', 'ghost-admin/config/environment', 'ember-ajax/errors'], function (exports, _ajax, _environment, _errors) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isThemeValidationError = exports.isMaintenanceError = exports.isUnsupportedMediaTypeError = exports.isRequestEntityTooLargeError = exports.isServerUnreachableError = exports.isVersionMismatchError = undefined;
    exports.VersionMismatchError = VersionMismatchError;
    exports.ServerUnreachableError = ServerUnreachableError;
    exports.RequestEntityTooLargeError = RequestEntityTooLargeError;
    exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
    exports.MaintenanceError = MaintenanceError;
    exports.ThemeValidationError = ThemeValidationError;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var computed = Ember.computed;
    var get = Ember.get;
    var isEmberArray = Ember.isArray;
    var isNone = Ember.isNone;
    var service = Ember.inject.service;


    var JSONContentType = 'application/json';

    function isJSONContentType(header) {
        if (!header || isNone(header)) {
            return false;
        }
        return header.indexOf(JSONContentType) === 0;
    }

    /* Version mismatch error */

    function VersionMismatchError(payload) {
        _errors.AjaxError.call(this, payload, 'API server is running a newer version of Ghost, please upgrade.');
    }

    VersionMismatchError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isVersionMismatchError(errorOrStatus, payload) {
        if ((0, _errors.isAjaxError)(errorOrStatus)) {
            return errorOrStatus instanceof VersionMismatchError;
        } else {
            return get(payload || {}, 'errors.firstObject.errorType') === 'VersionMismatchError';
        }
    }

    /* Request entity too large error */

    exports.isVersionMismatchError = _isVersionMismatchError;
    function ServerUnreachableError(payload) {
        _errors.AjaxError.call(this, payload, 'Server was unreachable');
    }

    ServerUnreachableError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isServerUnreachableError(error) {
        if ((0, _errors.isAjaxError)(error)) {
            return error instanceof ServerUnreachableError;
        } else {
            return error === 0 || error === '0';
        }
    }

    exports.isServerUnreachableError = _isServerUnreachableError;
    function RequestEntityTooLargeError(payload) {
        _errors.AjaxError.call(this, payload, 'Request is larger than the maximum file size the server allows');
    }

    RequestEntityTooLargeError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isRequestEntityTooLargeError(errorOrStatus) {
        if ((0, _errors.isAjaxError)(errorOrStatus)) {
            return errorOrStatus instanceof RequestEntityTooLargeError;
        } else {
            return errorOrStatus === 413;
        }
    }

    /* Unsupported media type error */

    exports.isRequestEntityTooLargeError = _isRequestEntityTooLargeError;
    function UnsupportedMediaTypeError(payload) {
        _errors.AjaxError.call(this, payload, 'Request contains an unknown or unsupported file type.');
    }

    UnsupportedMediaTypeError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isUnsupportedMediaTypeError(errorOrStatus) {
        if ((0, _errors.isAjaxError)(errorOrStatus)) {
            return errorOrStatus instanceof UnsupportedMediaTypeError;
        } else {
            return errorOrStatus === 415;
        }
    }

    /* Maintenance error */

    exports.isUnsupportedMediaTypeError = _isUnsupportedMediaTypeError;
    function MaintenanceError(payload) {
        _errors.AjaxError.call(this, payload, 'Ghost is currently undergoing maintenance, please wait a moment then retry.');
    }

    MaintenanceError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isMaintenanceError(errorOrStatus) {
        if ((0, _errors.isAjaxError)(errorOrStatus)) {
            return errorOrStatus instanceof MaintenanceError;
        } else {
            return errorOrStatus === 503;
        }
    }

    /* Theme validation error */

    exports.isMaintenanceError = _isMaintenanceError;
    function ThemeValidationError(payload) {
        _errors.AjaxError.call(this, payload, 'Theme is not compatible or contains errors.');
    }

    ThemeValidationError.prototype = Object.create(_errors.AjaxError.prototype);

    function _isThemeValidationError(errorOrStatus, payload) {
        if ((0, _errors.isAjaxError)(errorOrStatus)) {
            return errorOrStatus instanceof ThemeValidationError;
        } else {
            return get(payload || {}, 'errors.firstObject.errorType') === 'ThemeValidationError';
        }
    }

    /* end: custom error types */

    exports.isThemeValidationError = _isThemeValidationError;
    var ajaxService = _ajax.default.extend({
        session: service(),

        headers: computed('session.isAuthenticated', function () {
            var session = this.get('session');
            var headers = {};

            headers['X-Ghost-Version'] = _environment.default.APP.version;
            headers['App-Pragma'] = 'no-cache';

            if (session.get('isAuthenticated')) {
                session.authorize('authorizer:oauth2', function (headerName, headerValue) {
                    headers[headerName] = headerValue;
                });
            }

            return headers;
        }).volatile(),

        _makeRequest: function _makeRequest(hash) {
            var _this = this;

            var isAuthenticated = this.get('session.isAuthenticated');
            var isGhostRequest = hash.url.indexOf('/ghost/api/') !== -1;
            var isTokenRequest = isGhostRequest && hash.url.match(/authentication\/(?:token|ghost)/);
            var tokenExpiry = this.get('session.authenticated.expires_at');
            var isTokenExpired = tokenExpiry < new Date().getTime();

            if (isJSONContentType(hash.contentType) && hash.type !== 'GET') {
                if (_typeof(hash.data) === 'object') {
                    hash.data = JSON.stringify(hash.data);
                }
            }

            // we can get into a situation where the app is left open without a
            // network connection and the token subsequently expires, this will
            // result in the next network request returning a 401 and killing the
            // session. This is an attempt to detect that and restore the session
            // using the stored refresh token before continuing with the request
            //
            // TODO:
            // - this might be quite blunt, if we have a lot of requests at once
            //   we probably want to queue the requests until the restore completes
            // BUG:
            // - the original caller gets a rejected promise with `undefined` instead
            //   of the AjaxError object when session restore fails. This isn't a
            //   huge deal because the session will be invalidated and app reloaded
            //   but it would be nice to be consistent
            if (isAuthenticated && isGhostRequest && !isTokenRequest && isTokenExpired) {
                return this.get('session').restore().then(function () {
                    return _this._makeRequest(hash);
                });
            }

            return this._super.apply(this, arguments);
        },
        handleResponse: function handleResponse(status, headers, payload) {
            if (this.isVersionMismatchError(status, headers, payload)) {
                return new VersionMismatchError(payload);
            } else if (this.isServerUnreachableError(status, headers, payload)) {
                return new ServerUnreachableError(payload);
            } else if (this.isRequestEntityTooLargeError(status, headers, payload)) {
                return new RequestEntityTooLargeError(payload);
            } else if (this.isUnsupportedMediaTypeError(status, headers, payload)) {
                return new UnsupportedMediaTypeError(payload);
            } else if (this.isMaintenanceError(status, headers, payload)) {
                return new MaintenanceError(payload);
            } else if (this.isThemeValidationError(status, headers, payload)) {
                return new ThemeValidationError(payload);
            }

            // TODO: we may want to check that we are hitting our own API before
            // logging the user out due to a 401 response
            if (this.isUnauthorizedError(status, headers, payload) && this.get('session.isAuthenticated')) {
                this.get('session').invalidate();
            }

            return this._super.apply(this, arguments);
        },
        normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
            if (payload && (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === 'object') {
                var errors = payload.error || payload.errors || payload.message || undefined;

                if (errors) {
                    if (!isEmberArray(errors)) {
                        errors = [errors];
                    }

                    payload.errors = errors.map(function (error) {
                        if (typeof error === 'string') {
                            return { message: error };
                        } else {
                            return error;
                        }
                    });
                }
            }

            return this._super(status, headers, payload);
        },
        isVersionMismatchError: function isVersionMismatchError(status, headers, payload) {
            return _isVersionMismatchError(status, payload);
        },
        isServerUnreachableError: function isServerUnreachableError(status) {
            return _isServerUnreachableError(status);
        },
        isRequestEntityTooLargeError: function isRequestEntityTooLargeError(status) {
            return _isRequestEntityTooLargeError(status);
        },
        isUnsupportedMediaTypeError: function isUnsupportedMediaTypeError(status) {
            return _isUnsupportedMediaTypeError(status);
        },
        isMaintenanceError: function isMaintenanceError(status, headers, payload) {
            return _isMaintenanceError(status, payload);
        },
        isThemeValidationError: function isThemeValidationError(status, headers, payload) {
            return _isThemeValidationError(status, payload);
        }
    });

    // we need to reopen so that internal methods use the correct contentType
    ajaxService.reopen({
        contentType: 'application/json; charset=UTF-8'
    });

    exports.default = ajaxService;
});