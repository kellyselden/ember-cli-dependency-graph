define('ghost-admin/services/upgrade-status', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var service = Ember.inject.service;
    exports.default = Service.extend({
        isRequired: false,

        notifications: service(),

        maintenanceAlert: function maintenanceAlert() {
            this.get('notifications').showAlert('Sorry, Ghost is currently undergoing maintenance, please wait a moment then try again.', { type: 'error', key: 'api-error.under-maintenance' });
        },
        requireUpgrade: function requireUpgrade() {
            this.set('isRequired', true);
            this.get('notifications').showAlert('Ghost has been upgraded, please copy any unsaved data and refresh the page to continue.', { type: 'error', key: 'api-error.upgrade-required' });
        }
    });
});