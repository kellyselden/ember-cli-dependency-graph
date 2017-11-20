define('ghost-admin/components/modal-invite-new-user', ['exports', 'ghost-admin/components/modal-base', 'ghost-admin/mixins/validation-engine', 'ember-concurrency'], function (exports, _modalBase, _validationEngine, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    var emberA = Ember.A;
    var run = Ember.run;
    var service = Ember.inject.service;
    var Promise = RSVP.Promise;
    exports.default = _modalBase.default.extend(_validationEngine.default, {
        classNames: 'modal-content invite-new-user',

        role: null,
        roles: null,
        authorRole: null,

        validationType: 'inviteUser',

        notifications: service(),
        store: service(),

        init: function init() {
            this._super.apply(this, arguments);

            // populate roles and set initial value for the dropdown
            run.schedule('afterRender', this, function () {
                var _this = this;

                this.get('store').query('role', { permissions: 'assign' }).then(function (roles) {
                    var authorRole = roles.findBy('name', 'Author');

                    _this.set('roles', roles);
                    _this.set('authorRole', authorRole);

                    if (!_this.get('role')) {
                        _this.set('role', authorRole);
                    }
                });
            });
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            // TODO: this should not be needed, ValidationEngine acts as a
            // singleton and so it's errors and hasValidated state stick around
            this.get('errors').clear();
            this.set('hasValidated', emberA());
        },
        validate: function validate() {
            var _this2 = this;

            var email = this.get('email');

            // TODO: either the validator should check the email's existence or
            // the API should return an appropriate error when attempting to save
            return new Promise(function (resolve, reject) {
                return _this2._super().then(function () {
                    return RSVP.hash({
                        users: _this2.get('store').findAll('user', { reload: true }),
                        invites: _this2.get('store').findAll('invite', { reload: true })
                    }).then(function (data) {
                        var existingUser = data.users.findBy('email', email);
                        var existingInvite = data.invites.findBy('email', email);

                        if (existingUser || existingInvite) {
                            _this2.get('errors').clear('email');
                            if (existingUser) {
                                _this2.get('errors').add('email', 'A user with that email address already exists.');
                            } else {
                                _this2.get('errors').add('email', 'A user with that email address was already invited.');
                            }

                            // TODO: this shouldn't be needed, ValidationEngine doesn't mark
                            // properties as validated when validating an entire object
                            _this2.get('hasValidated').addObject('email');
                            reject();
                        } else {
                            resolve();
                        }
                    });
                }, function () {
                    // TODO: this shouldn't be needed, ValidationEngine doesn't mark
                    // properties as validated when validating an entire object
                    _this2.get('hasValidated').addObject('email');
                    reject();
                });
            });
        },


        sendInvitation: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var email, role, notifications, notificationText, invite;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            email = this.get('email');
                            role = this.get('role');
                            notifications = this.get('notifications');
                            notificationText = 'Invitation sent! (' + email + ')';
                            invite = void 0;
                            _context.prev = 5;
                            _context.next = 8;
                            return this.validate();

                        case 8:

                            invite = this.get('store').createRecord('invite', {
                                email: email,
                                role: role
                            });

                            _context.next = 11;
                            return invite.save();

                        case 11:

                            // If sending the invitation email fails, the API will still return a status of 201
                            // but the invite's status in the response object will be 'invited-pending'.
                            if (invite.get('status') === 'pending') {
                                notifications.showAlert('Invitation email was not sent.  Please try resending.', { type: 'error', key: 'invite.send.failed' });
                            } else {
                                notifications.showNotification(notificationText, { key: 'invite.send.success' });
                            }

                            this.send('closeModal');
                            _context.next = 18;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](5);

                            // validation will reject and cause this to be called with no error
                            if (_context.t0) {
                                invite.deleteRecord();
                                notifications.showAPIError(_context.t0, { key: 'invite.send' });
                                this.send('closeModal');
                            }

                        case 18:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[5, 15]]);
        })).drop(),

        actions: {
            setRole: function setRole(role) {
                this.set('role', role);
            },
            confirm: function confirm() {
                this.get('sendInvitation').perform();
            }
        }
    });
});