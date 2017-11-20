define('ghost-admin/controllers/about', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    exports.default = Controller.extend({
        updateNotificationCount: 0,

        actions: {
            updateNotificationChange: function updateNotificationChange(count) {
                this.set('updateNotificationCount', count);
            }
        },

        copyrightYear: computed(function () {
            var date = new Date();
            return date.getFullYear();
        })
    });
});