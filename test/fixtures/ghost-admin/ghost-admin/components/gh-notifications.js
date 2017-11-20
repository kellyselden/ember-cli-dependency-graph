define('ghost-admin/components/gh-notifications', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: 'aside',
        classNames: 'gh-notifications',

        notifications: service(),

        messages: alias('notifications.notifications')
    });
});