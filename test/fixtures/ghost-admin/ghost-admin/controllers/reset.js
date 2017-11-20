define('ghost-admin/controllers/reset', ['exports', 'ghost-admin/mixins/validation-engine', 'ember-concurrency'], function (exports, _validationEngine, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Controller.extend(_validationEngine.default, {
        newPassword: '',
        ne2Password: '',
        token: '',
        flowErrors: '',

        validationType: 'reset',

        ghostPaths: service(),
        notifications: service(),
        session: service(),
        ajax: service(),
        config: service(),

        email: computed('token', function () {
            // The token base64 encodes the email (and some other stuff),
            // each section is divided by a '|'. Email comes second.
            return atob(this.get('token')).split('|')[1];
        }),

        // Used to clear sensitive information
        clearData: function clearData() {
            this.setProperties({
                newPassword: '',
                ne2Password: '',
                token: ''
            });
        },


        resetPassword: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var credentials, authUrl, resp;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            credentials = this.getProperties('newPassword', 'ne2Password', 'token');
                            authUrl = this.get('ghostPaths.url').api('authentication', 'passwordreset');


                            this.set('flowErrors', '');
                            this.get('hasValidated').addObjects(['newPassword', 'ne2Password']);

                            _context.prev = 4;
                            _context.next = 7;
                            return this.validate();

                        case 7:
                            _context.prev = 7;
                            _context.next = 10;
                            return this.get('ajax').put(authUrl, {
                                data: {
                                    passwordreset: [credentials]
                                }
                            });

                        case 10:
                            resp = _context.sent;

                            this.get('notifications').showAlert(resp.passwordreset[0].message, { type: 'warn', delayed: true, key: 'password.reset' });
                            this.get('session').authenticate('authenticator:oauth2', this.get('email'), credentials.newPassword);
                            return _context.abrupt('return', true);

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context['catch'](7);

                            this.get('notifications').showAPIError(_context.t0, { key: 'password.reset' });

                        case 19:
                            _context.next = 27;
                            break;

                        case 21:
                            _context.prev = 21;
                            _context.t1 = _context['catch'](4);

                            if (this.get('errors.newPassword')) {
                                this.set('flowErrors', this.get('errors.newPassword')[0].message);
                            }

                            if (this.get('errors.ne2Password')) {
                                this.set('flowErrors', this.get('errors.ne2Password')[0].message);
                            }

                            if (!(_context.t1 && this.get('errors.length') === 0)) {
                                _context.next = 27;
                                break;
                            }

                            throw _context.t1;

                        case 27:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[4, 21], [7, 16]]);
        })).drop(),

        actions: {
            submit: function submit() {
                return this.get('resetPassword').perform();
            }
        }
    });
});