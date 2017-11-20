define('ghost-admin/controllers/setup/three', ['exports', 'ember-data', 'ember-ajax/errors', 'ember-concurrency'], function (exports, _emberData, _errors, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var RSVP = Ember.RSVP;
    var alias = Ember.computed.alias;
    var computed = Ember.computed;
    var emberA = Ember.A;
    var htmlSafe = Ember.String.htmlSafe;
    var run = Ember.run;
    var service = Ember.inject.service;
    var Errors = _emberData.default.Errors;
    exports.default = Controller.extend({
        notifications: service(),
        two: controller('setup/two'),

        errors: Errors.create(),
        hasValidated: emberA(),
        users: '',
        ownerEmail: alias('two.email'),

        usersArray: computed('users', function () {
            var errors = this.get('errors');
            var users = this.get('users').split('\n').filter(function (email) {
                return email.trim().length > 0;
            });

            // remove "no users to invite" error if we have users
            if (users.uniq().length > 0 && errors.get('users.length') === 1) {
                if (errors.get('users.firstObject').message.match(/no users/i)) {
                    errors.remove('users');
                }
            }

            return users.uniq();
        }),

        validUsersArray: computed('usersArray', 'ownerEmail', function () {
            var ownerEmail = this.get('ownerEmail');

            return this.get('usersArray').filter(function (user) {
                return validator.isEmail(user) && user !== ownerEmail;
            });
        }),

        invalidUsersArray: computed('usersArray', 'ownerEmail', function () {
            var ownerEmail = this.get('ownerEmail');

            return this.get('usersArray').reject(function (user) {
                return validator.isEmail(user) || user === ownerEmail;
            });
        }),

        validationResult: computed('invalidUsersArray', function () {
            var errors = [];

            this.get('invalidUsersArray').forEach(function (user) {
                errors.push({
                    user: user,
                    error: 'email'
                });
            });

            if (errors.length === 0) {
                // ensure we aren't highlighting fields when everything is fine
                this.get('errors').clear();
                return true;
            } else {
                return errors;
            }
        }),

        validate: function validate() {
            var errors = this.get('errors');
            var validationResult = this.get('validationResult');
            var property = 'users';

            errors.clear();

            // If property isn't in the `hasValidated` array, add it to mark that this field can show a validation result
            this.get('hasValidated').addObject(property);

            if (validationResult === true) {
                return true;
            }

            validationResult.forEach(function (error) {
                // Only one error type here so far, but one day the errors might be more detailed
                switch (error.error) {
                    case 'email':
                        errors.add(property, error.user + ' is not a valid email.');
                }
            });

            return false;
        },


        buttonText: computed('errors.users', 'validUsersArray', 'invalidUsersArray', function () {
            var usersError = this.get('errors.users.firstObject.message');
            var validNum = this.get('validUsersArray').length;
            var invalidNum = this.get('invalidUsersArray').length;
            var userCount = void 0;

            if (usersError && usersError.match(/no users/i)) {
                return usersError;
            }

            if (invalidNum > 0) {
                userCount = invalidNum === 1 ? 'email address' : 'email addresses';
                return invalidNum + ' invalid ' + userCount;
            }

            if (validNum > 0) {
                userCount = validNum === 1 ? 'user' : 'users';
                userCount = validNum + ' ' + userCount;
            } else {
                userCount = 'some users';
            }

            return 'Invite ' + userCount;
        }),

        buttonClass: computed('validationResult', 'usersArray.length', function () {
            if (this.get('validationResult') === true && this.get('usersArray.length') > 0) {
                return 'gh-btn-green';
            } else {
                return 'gh-btn-minor';
            }
        }),

        authorRole: computed(function () {
            return this.store.findAll('role', { reload: true }).then(function (roles) {
                return roles.findBy('name', 'Author');
            });
        }),

        _transitionAfterSubmission: function _transitionAfterSubmission() {
            if (!this._hasTransitioned) {
                this._hasTransitioned = true;
                this.transitionToRoute('posts.index');
            }
        },


        invite: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var users, authorRole, invites;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            users = this.get('validUsersArray');

                            if (!(this.validate() && users.length > 0)) {
                                _context.next = 15;
                                break;
                            }

                            this._hasTransitioned = false;

                            this.get('_slowSubmissionTimeout').perform();

                            _context.next = 6;
                            return this.get('authorRole');

                        case 6:
                            authorRole = _context.sent;
                            _context.next = 9;
                            return this._saveInvites(authorRole);

                        case 9:
                            invites = _context.sent;


                            this.get('_slowSubmissionTimeout').cancelAll();

                            this._showNotifications(invites);

                            run.schedule('actions', this, function () {
                                this.send('loadServerNotifications');
                                this._transitionAfterSubmission();
                            });

                            _context.next = 16;
                            break;

                        case 15:
                            if (users.length === 0) {
                                this.get('errors').add('users', 'No users to invite');
                            }

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).drop(),

        _slowSubmissionTimeout: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return (0, _emberConcurrency.timeout)(4000);

                        case 2:
                            this._transitionAfterSubmission();

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })).drop(),

        _saveInvites: function _saveInvites(authorRole) {
            var _this = this;

            var users = this.get('validUsersArray');

            return RSVP.Promise.all(users.map(function (user) {
                var invite = _this.store.createRecord('invite', {
                    email: user,
                    role: authorRole
                });

                return invite.save().then(function () {
                    return {
                        email: user,
                        success: invite.get('status') === 'sent'
                    };
                }).catch(function (error) {
                    return {
                        error: error,
                        email: user,
                        success: false
                    };
                });
            }));
        },
        _showNotifications: function _showNotifications(invites) {
            var notifications = this.get('notifications');
            var erroredEmails = [];
            var successCount = 0;
            var invitationsString = void 0,
                message = void 0;

            invites.forEach(function (invite) {
                if (invite.success) {
                    successCount++;
                } else if ((0, _errors.isInvalidError)(invite.error)) {
                    message = invite.email + ' was invalid: ' + invite.error.payload.errors[0].message;
                    notifications.showAlert(message, { type: 'error', delayed: true, key: 'signup.send-invitations.' + invite.email });
                } else {
                    erroredEmails.push(invite.email);
                }
            });

            if (erroredEmails.length > 0) {
                invitationsString = erroredEmails.length > 1 ? ' invitations: ' : ' invitation: ';
                message = 'Failed to send ' + erroredEmails.length + ' ' + invitationsString;
                message += erroredEmails.join(', ');
                message += ". Please check your email configuration, see <a href='https://docs.ghost.org/v1.0.0/docs/mail-config' target='_blank'>https://docs.ghost.org/v1.0.0/docs/mail-config</a> for instructions";

                message = htmlSafe(message);
                notifications.showAlert(message, { type: 'error', delayed: successCount > 0, key: 'signup.send-invitations.failed' });
            }

            if (successCount > 0) {
                // pluralize
                invitationsString = successCount > 1 ? 'invitations' : 'invitation';
                notifications.showAlert(successCount + ' ' + invitationsString + ' sent!', { type: 'success', delayed: true, key: 'signup.send-invitations.success' });
            }
        },


        actions: {
            validate: function validate() {
                this.validate();
            },
            invite: function invite() {
                this.get('invite').perform();
            },
            skipInvite: function skipInvite() {
                this.send('loadServerNotifications');
                this.transitionToRoute('posts.index');
            }
        }
    });
});