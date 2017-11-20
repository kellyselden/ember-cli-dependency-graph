define('ghost-admin/controllers/setup/two', ['exports', 'ghost-admin/mixins/validation-engine', 'ember-ajax/errors', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _validationEngine, _errors, _ajax, _emberConcurrency) {
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
    var controller = Ember.inject.controller;
    var RSVP = Ember.RSVP;
    var service = Ember.inject.service;
    exports.default = Controller.extend(_validationEngine.default, {
        ajax: service(),
        application: controller(),
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),
        settings: service(),

        // ValidationEngine settings
        validationType: 'setup',

        blogCreated: false,
        blogTitle: null,
        email: '',
        flowErrors: '',
        profileImage: null,
        name: null,
        password: null,

        setup: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._passwordSetup();

                        case 2:
                            return _context.abrupt('return', _context.sent);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })),

        authenticate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(authStrategy, authentication) {
            var _get, authResult;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            // we don't want to redirect after sign-in during setup
                            this.set('session.skipAuthSuccessHandler', true);

                            _context2.prev = 1;
                            _context2.next = 4;
                            return (_get = this.get('session')).authenticate.apply(_get, [authStrategy].concat(_toConsumableArray(authentication)));

                        case 4:
                            authResult = _context2.sent;


                            this.get('errors').remove('session');

                            return _context2.abrupt('return', authResult);

                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2['catch'](1);

                            if (!(_context2.t0 && _context2.t0.payload && _context2.t0.payload.errors)) {
                                _context2.next = 18;
                                break;
                            }

                            if (!(0, _ajax.isVersionMismatchError)(_context2.t0)) {
                                _context2.next = 14;
                                break;
                            }

                            return _context2.abrupt('return', this.get('notifications').showAPIError(_context2.t0));

                        case 14:

                            _context2.t0.payload.errors.forEach(function (err) {
                                err.message = err.message.htmlSafe();
                            });

                            this.set('flowErrors', _context2.t0.payload.errors[0].message.string);
                            _context2.next = 19;
                            break;

                        case 18:
                            // Connection errors don't return proper status message, only req.body
                            this.get('notifications').showAlert('There was a problem on the server.', { type: 'error', key: 'session.authenticate.failed' });

                        case 19:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[1, 9]]);
        })),

        /**
         * Uploads the given data image, then sends the changed user image property to the server
         * @param  {Object} user User object, returned from the 'setup' api call
         * @return {Ember.RSVP.Promise} A promise that takes care of both calls
         */
        _sendImage: function _sendImage(user) {
            var _this = this;

            var formData = new FormData();
            var imageFile = this.get('profileImage');
            var uploadUrl = this.get('ghostPaths.url').api('uploads');

            formData.append('uploadimage', imageFile, imageFile.name);

            return this.get('ajax').post(uploadUrl, {
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'text'
            }).then(function (response) {
                var imageUrl = JSON.parse(response);
                var usersUrl = _this.get('ghostPaths.url').api('users', user.id.toString());
                user.profile_image = imageUrl;

                return _this.get('ajax').put(usersUrl, {
                    data: {
                        users: [user]
                    }
                });
            });
        },
        _passwordSetup: function _passwordSetup() {
            var _this2 = this;

            var setupProperties = ['blogTitle', 'name', 'email', 'password'];
            var data = this.getProperties(setupProperties);
            var config = this.get('config');
            var method = this.get('blogCreated') ? 'put' : 'post';

            this.set('flowErrors', '');

            this.get('hasValidated').addObjects(setupProperties);

            return this.validate().then(function () {
                var authUrl = _this2.get('ghostPaths.url').api('authentication', 'setup');

                return _this2.get('ajax')[method](authUrl, {
                    data: {
                        setup: [{
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            blogTitle: data.blogTitle
                        }]
                    }
                }).then(function (result) {
                    config.set('blogTitle', data.blogTitle);

                    // don't try to login again if we are already logged in
                    if (_this2.get('session.isAuthenticated')) {
                        return _this2._afterAuthentication(result);
                    }

                    // Don't call the success handler, otherwise we will be redirected to admin
                    _this2.set('session.skipAuthSuccessHandler', true);

                    return _this2.get('session').authenticate('authenticator:oauth2', _this2.get('email'), _this2.get('password')).then(function () {
                        _this2.set('blogCreated', true);
                        return _this2._afterAuthentication(result);
                    }).catch(function (error) {
                        _this2._handleAuthenticationError(error);
                    }).finally(function () {
                        _this2.set('session.skipAuthSuccessHandler', undefined);
                    });
                }).catch(function (error) {
                    _this2._handleSaveError(error);
                });
            }).catch(function () {
                _this2.set('flowErrors', 'Please fill out the form to setup your blog.');
            });
        },
        _handleSaveError: function _handleSaveError(resp) {
            if ((0, _errors.isInvalidError)(resp)) {
                this.set('flowErrors', resp.payload.errors[0].message);
            } else {
                this.get('notifications').showAPIError(resp, { key: 'setup.blog-details' });
            }
        },
        _handleAuthenticationError: function _handleAuthenticationError(error) {
            if (error && error.payload && error.payload.errors) {
                this.set('flowErrors', error.payload.errors[0].message);
            } else {
                // Connection errors don't return proper status message, only req.body
                this.get('notifications').showAlert('There was a problem on the server.', { type: 'error', key: 'setup.authenticate.failed' });
            }
        },
        _afterAuthentication: function _afterAuthentication(result) {
            var _this3 = this;

            var promises = [];

            promises.pushObject(this.get('settings').fetch());
            promises.pushObject(this.get('config').fetchPrivate());

            if (this.get('profileImage')) {
                return this._sendImage(result.users[0]).then(function () {
                    // fetch settings and private config for synchronous access before transitioning
                    return RSVP.all(promises).then(function () {
                        return _this3.transitionToRoute('setup.three');
                    });
                }).catch(function (resp) {
                    _this3.get('notifications').showAPIError(resp, { key: 'setup.blog-details' });
                });
            } else {
                // fetch settings and private config for synchronous access before transitioning
                return RSVP.all(promises).then(function () {
                    return _this3.transitionToRoute('setup.three');
                });
            }
        },


        actions: {
            setup: function setup() {
                this.get('setup').perform();
            },
            preValidate: function preValidate(model) {
                // Only triggers validation if a value has been entered, preventing empty errors on focusOut
                if (this.get(model)) {
                    return this.validate({ property: model });
                }
            },
            setImage: function setImage(image) {
                this.set('profileImage', image);
            }
        }
    });
});