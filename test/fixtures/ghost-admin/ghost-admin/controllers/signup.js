define('ghost-admin/controllers/signup', ['exports', 'ghost-admin/mixins/validation-engine', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _validationEngine, _ajax, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var Controller = Ember.Controller;
    var RSVP = Ember.RSVP;
    var isEmberArray = Ember.isArray;
    var service = Ember.inject.service;
    exports.default = Controller.extend(_validationEngine.default, {
        ajax: service(),
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),
        settings: service(),

        // ValidationEngine settings
        validationType: 'signup',

        flowErrors: '',
        profileImage: null,

        authenticate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(authStrategy, authentication) {
            var _get, authResult, promises, versionMismatchError;

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

                            if (!(_context.t0 && _context.t0.payload && _context.t0.payload.errors)) {
                                _context.next = 24;
                                break;
                            }

                            if (!(0, _ajax.isVersionMismatchError)(null, _context.t0)) {
                                _context.next = 18;
                                break;
                            }

                            versionMismatchError = new _ajax.VersionMismatchError(_context.t0);
                            return _context.abrupt('return', this.get('notifications').showAPIError(versionMismatchError));

                        case 18:

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
                            _context.next = 26;
                            break;

                        case 24:
                            // Connection errors don't return proper status message, only req.body
                            this.get('notifications').showAlert('There was a problem on the server.', { type: 'error', key: 'session.authenticate.failed' });
                            throw _context.t0;

                        case 26:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 12]]);
        })).drop(),

        signup: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var setupProperties, notifications;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            setupProperties = ['name', 'email', 'password', 'token'];
                            notifications = this.get('notifications');


                            this.set('flowErrors', '');
                            this.get('hasValidated').addObjects(setupProperties);

                            _context2.prev = 4;
                            _context2.next = 7;
                            return this.validate();

                        case 7:
                            _context2.next = 9;
                            return this._completeInvitation();

                        case 9:
                            _context2.prev = 9;
                            _context2.next = 12;
                            return this._authenticateWithPassword();

                        case 12:
                            _context2.next = 14;
                            return this._sendImage();

                        case 14:
                            _context2.next = 19;
                            break;

                        case 16:
                            _context2.prev = 16;
                            _context2.t0 = _context2['catch'](9);

                            notifications.showAPIError(_context2.t0, { key: 'signup.complete' });

                        case 19:
                            _context2.next = 25;
                            break;

                        case 21:
                            _context2.prev = 21;
                            _context2.t1 = _context2['catch'](4);

                            // ValidationEngine throws undefined
                            if (!_context2.t1) {
                                this.set('flowErrors', 'Please fill out the form to complete your sign-up');
                            }

                            if (_context2.t1 && _context2.t1.payload && _context2.t1.payload.errors && isEmberArray(_context2.t1.payload.errors)) {
                                if ((0, _ajax.isVersionMismatchError)(_context2.t1)) {
                                    notifications.showAPIError(_context2.t1);
                                }
                                this.set('flowErrors', _context2.t1.payload.errors[0].message);
                            } else {
                                notifications.showAPIError(_context2.t1, { key: 'signup.complete' });
                            }

                        case 25:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[4, 21], [9, 16]]);
        })),

        _completeInvitation: function _completeInvitation() {
            var authUrl = this.get('ghostPaths.url').api('authentication', 'invitation');
            var model = this.get('model');

            return this.get('ajax').post(authUrl, {
                dataType: 'json',
                data: {
                    invitation: [{
                        name: model.get('name'),
                        email: model.get('email'),
                        password: model.get('password'),
                        token: model.get('token')
                    }]
                }
            });
        },
        _authenticateWithPassword: function _authenticateWithPassword() {
            var email = this.get('model.email');
            var password = this.get('model.password');

            return this.get('session').authenticate('authenticator:oauth2', email, password);
        },
        _sendImage: function _sendImage() {
            var _this = this;

            var formData = new FormData();
            var imageFile = this.get('profileImage');
            var uploadUrl = this.get('ghostPaths.url').api('uploads');

            if (imageFile) {
                formData.append('uploadimage', imageFile, imageFile.name);

                return this.get('session.user').then(function (user) {
                    return _this.get('ajax').post(uploadUrl, {
                        data: formData,
                        processData: false,
                        contentType: false,
                        dataType: 'text'
                    }).then(function (response) {
                        var imageUrl = JSON.parse(response);
                        var usersUrl = _this.get('ghostPaths.url').api('users', user.id.toString());
                        // eslint-disable-next-line
                        user.profile_image = imageUrl;

                        return _this.get('ajax').put(usersUrl, {
                            data: {
                                users: [user]
                            }
                        });
                    });
                });
            }
        },


        actions: {
            signup: function signup() {
                this.get('signup').perform();
            },
            setImage: function setImage(image) {
                this.set('profileImage', image);
            }
        }
    });
});