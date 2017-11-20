define('ghost-admin/components/gh-user-invited', ['exports', 'moment', 'ember-ajax/errors'], function (exports, _moment, _errors) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: '',

        invite: null,
        isSending: false,

        notifications: service(),
        store: service(),

        createdAt: computed('invite.createdAtUTC', function () {
            var createdAtUTC = this.get('invite.createdAtUTC');

            return createdAtUTC ? (0, _moment.default)(createdAtUTC).fromNow() : '';
        }),

        expiresAt: computed('invite.expires', function () {
            var expires = this.get('invite.expires');

            return expires ? (0, _moment.default)(expires).fromNow() : '';
        }),

        isExpired: computed('invite.expires', function () {
            var expires = this.get('invite.expires');
            var now = new Date().valueOf();

            return expires < now;
        }),

        actions: {
            resend: function resend() {
                var _this = this;

                var invite = this.get('invite');
                var notifications = this.get('notifications');

                this.set('isSending', true);
                invite.resend().then(function (result) {
                    var notificationText = 'Invitation resent! (' + invite.get('email') + ')';

                    // the server deletes the old record and creates a new one when
                    // resending so we need to update the store accordingly
                    invite.unloadRecord();
                    _this.get('store').pushPayload('invite', result);

                    // If sending the invitation email fails, the API will still return a status of 201
                    // but the invite's status in the response object will be 'invited-pending'.
                    if (result.invites[0].status === 'invited-pending') {
                        notifications.showAlert('Invitation email was not sent.  Please try resending.', { type: 'error', key: 'invite.resend.not-sent' });
                    } else {
                        notifications.showNotification(notificationText, { key: 'invite.resend.success' });
                    }
                }).catch(function (error) {
                    notifications.showAPIError(error, { key: 'invite.resend' });
                }).finally(function () {
                    _this.set('isSending', false);
                });
            },
            revoke: function revoke() {
                var _this2 = this;

                var invite = this.get('invite');
                var email = invite.get('email');
                var notifications = this.get('notifications');

                // reload the invite to get the most up-to-date information
                invite.reload().then(function () {
                    invite.destroyRecord().then(function () {
                        var notificationText = 'Invitation revoked. (' + email + ')';
                        notifications.showNotification(notificationText, { key: 'invite.revoke.success' });
                    }).catch(function (error) {
                        notifications.showAPIError(error, { key: 'invite.revoke' });
                    });
                }).catch(function (error) {
                    if ((0, _errors.isNotFoundError)(error)) {
                        // if the invite no longer exists, then show a warning and reload the route
                        _this2.sendAction('reload');
                        notifications.showAlert('This invite has been revoked or a user has already accepted the invitation.', { type: 'error', delayed: true, key: 'invite.revoke.already-accepted' });
                    } else {
                        throw error;
                    }
                });
            }
        }
    });
});