define('ghost-admin/controllers/team/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var service = Ember.inject.service;
    var sort = Ember.computed.sort;
    exports.default = Controller.extend({

        showInviteUserModal: false,

        activeUsers: null,
        suspendedUsers: null,
        invites: null,

        session: service(),

        inviteOrder: ['email'],
        sortedInvites: sort('invites', 'inviteOrder'),

        userOrder: ['name', 'email'],

        sortedActiveUsers: sort('activeUsers', 'userOrder'),
        sortedSuspendedUsers: sort('suspendedUsers', 'userOrder'),

        actions: {
            toggleInviteUserModal: function toggleInviteUserModal() {
                this.toggleProperty('showInviteUserModal');
            }
        }
    });
});