define('ghost-admin/controllers/signin', ['exports', 'ghost-admin/mixins/validation-engine', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _validationEngine, _ajax, _emberConcurrency) {
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

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var $ = Ember.$;
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var RSVP = Ember.RSVP;
    var isEmberArray = Ember.isArray;
    var service = Ember.inject.service;
    exports.default = Controller.extend(_validationEngine.default, {
        submitting: false,
        loggingIn: false,
        authProperties: ['identification', 'password'],

        ajax: service(),
        application: controller(),
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),
        settings: service(),

        flowErrors: '',

        // ValidationEngine settings
        validationType: 'signin',

        authenticate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(authStrategy, authentication) {
            var _get, authResult, promises;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return (_get = this.get('session')).authenticate.apply(_get, [authStrategy].concat(_toConsumableArray(authentication)));

                        case 3:
                            authResult = _context.sent;
                            promises = [];


                            promises.pushObject(this.get('settings').fetch());
                            promises.pushObject(this.get('config').fetchPrivate());

                            // fetch settings and private config for synchronous access
                            _context.next = 9;
                            return RSVP.all(promises);

                        case 9:
                            return _context.abrupt('return', authResult);

                        case 12:
                            _context.prev = 12;
                            _context.t0 = _context['catch'](0);

                            if (!(0, _ajax.isVersionMismatchError)(_context.t0)) {
                                _context.next = 16;
                                break;
                            }

                            return _context.abrupt('return', this.get('notifications').showAPIError(_context.t0));

                        case 16:

                            if (_context.t0 && _context.t0.payload && _context.t0.payload.errors) {
                                _context.t0.payload.errors.forEach(function (err) {
                                    err.message = err.message.htmlSafe();
                                });

                                this.set('flowErrors', _context.t0.payload.errors[0].message.string);

                                if (_context.t0.payload.errors[0].message.string.match(/user with that email/)) {
                                    this.get('model.errors').add('identification', '');
                                }

                                if (_context.t0.payload.errors[0].message.string.match(/password is incorrect/)) {
                                    this.get('model.errors').add('password', '');
                                }
                            } else {
                                // Connection errors don't return proper status message, only req.body
                                this.get('notifications').showAlert('There was a problem on the server.', { type: 'error', key: 'session.authenticate.failed' });
                            }

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 12]]);
        })).drop(),

        validateAndAuthenticate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var model, authStrategy;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            model = this.get('model');
                            authStrategy = 'authenticator:oauth2';


                            this.set('flowErrors', '');
                            // Manually trigger events for input fields, ensuring legacy compatibility with
                            // browsers and password managers that don't send proper events on autofill
                            $('#login').find('input').trigger('change');

                            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'signin'
                            this.get('hasValidated').addObjects(this.authProperties);

                            _context2.prev = 5;
                            _context2.next = 8;
                            return this.validate({ property: 'signin' });

                        case 8:
                            _context2.next = 10;
                            return this.get('authenticate').perform(authStrategy, [model.get('identification'), model.get('password')]);

                        case 10:
                            return _context2.abrupt('return', _context2.sent);

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2['catch'](5);

                            this.set('flowErrors', 'Please fill out the form to sign in.');

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[5, 13]]);
        })).drop(),

        forgotten: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var email, forgottenUrl, notifications, _error$payload$errors, message;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            email = this.get('model.identification');
                            forgottenUrl = this.get('ghostPaths.url').api('authentication', 'passwordreset');
                            notifications = this.get('notifications');


                            this.set('flowErrors', '');
                            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'forgotPassword'
                            this.get('hasValidated').addObject('identification');

                            _context3.prev = 5;
                            _context3.next = 8;
                            return this.validate({ property: 'forgotPassword' });

                        case 8:
                            _context3.next = 10;
                            return this.get('ajax').post(forgottenUrl, { data: { passwordreset: [{ email: email }] } });

                        case 10:
                            notifications.showAlert('Please check your email for instructions.', { type: 'info', key: 'forgot-password.send.success' });
                            return _context3.abrupt('return', true);

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](5);

                            if (_context3.t0) {
                                _context3.next = 18;
                                break;
                            }

                            return _context3.abrupt('return', this.set('flowErrors', 'We need your email address to reset your password!'));

                        case 18:
                            if (!(0, _ajax.isVersionMismatchError)(_context3.t0)) {
                                _context3.next = 20;
                                break;
                            }

                            return _context3.abrupt('return', notifications.showAPIError(_context3.t0));

                        case 20:

                            if (_context3.t0 && _context3.t0.payload && _context3.t0.payload.errors && isEmberArray(_context3.t0.payload.errors)) {
                                _error$payload$errors = _slicedToArray(_context3.t0.payload.errors, 1), message = _error$payload$errors[0].message;


                                this.set('flowErrors', message);

                                if (message.match(/no user with that email/)) {
                                    this.get('model.errors').add('identification', '');
                                }
                            } else {
                                notifications.showAPIError(_context3.t0, { defaultErrorText: 'There was a problem with the reset, please try again.', key: 'forgot-password.send' });
                            }

                        case 21:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[5, 14]]);
        })),

        actions: {
            authenticate: function authenticate() {
                this.get('validateAndAuthenticate').perform();
            }
        }
    });
});