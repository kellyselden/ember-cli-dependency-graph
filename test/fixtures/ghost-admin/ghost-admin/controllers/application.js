define('ghost-admin/controllers/application', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        dropdown: service(),
        session: service(),
        settings: service(),
        ui: service(),

        showNavMenu: computed('currentPath', 'session.isAuthenticated', 'session.user.isFulfilled', function () {
            // we need to defer showing the navigation menu until the session.user
            // promise has fulfilled so that gh-user-can-admin has the correct data
            if (!this.get('session.isAuthenticated') || !this.get('session.user.isFulfilled')) {
                return false;
            }

            return (this.get('currentPath') !== 'error404' || this.get('session.isAuthenticated')) && !this.get('currentPath').match(/(signin|signup|setup|reset)/);
        }),

        topNotificationCount: 0,
        showMarkdownHelpModal: false,

        actions: {
            topNotificationChange: function topNotificationChange(count) {
                this.set('topNotificationCount', count);
            }
        }
    });
});