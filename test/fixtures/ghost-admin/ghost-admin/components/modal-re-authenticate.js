define('ghost-admin/components/modal-re-authenticate', ['exports', 'ghost-admin/components/modal-base', 'ghost-admin/mixins/validation-engine', 'ghost-admin/services/ajax', 'ember-concurrency'], function (exports, _modalBase, _validationEngine, _ajax, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var service = Ember.inject.service;
    exports.default = _modalBase.default.extend(_validationEngine.default, {
        validationType: 'signin',

        authenticationError: null,

        config: service(),
        notifications: service(),
        session: service(),

        identification: computed('session.user.email', function () {
            return this.get('session.user.email');
        }),

        _authenticate: function _authenticate() {
            var _this = this;

            var session = this.get('session');
            var authStrategy = 'authenticator:oauth2';
            var identification = this.get('identification');
            var password = this.get('password');

            session.set('skipAuthSuccessHandler', true);

            this.toggleProperty('submitting');

            return session.authenticate(authStrategy, identification, password).finally(function () {
                _this.toggleProperty('submitting');
                session.set('skipAuthSuccessHandler', undefined);
            });
        },
        _passwordConfirm: function _passwordConfirm() {
            var _this2 = this;

            // Manually trigger events for input fields, ensuring legacy compatibility with
            // browsers and password managers that don't send proper events on autofill
            $('#login').find('input').trigger('change');

            this.set('authenticationError', null);

            return this.validate({ property: 'signin' }).then(function () {
                return _this2._authenticate().then(function () {
                    _this2.get('notifications').closeAlerts();
                    _this2.send('closeModal');
                    return true;
                }).catch(function (error) {
                    if (error && error.payload && error.payload.errors) {
                        error.payload.errors.forEach(function (err) {
                            if ((0, _ajax.isVersionMismatchError)(err)) {
                                return _this2.get('notifications').showAPIError(error);
                            }
                            err.message = htmlSafe(err.context || err.message);
                        });

                        _this2.get('errors').add('password', 'Incorrect password');
                        _this2.get('hasValidated').pushObject('password');
                        _this2.set('authenticationError', error.payload.errors[0].message);
                    }
                });
            }, function () {
                _this2.get('hasValidated').pushObject('password');
                return false;
            });
        },


        reauthenticate: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._passwordConfirm();

                        case 2:
                            return _context.abrupt('return', _context.sent);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).drop(),

        actions: {
            confirm: function confirm() {
                this.get('reauthenticate').perform();
            }
        }
    });
});