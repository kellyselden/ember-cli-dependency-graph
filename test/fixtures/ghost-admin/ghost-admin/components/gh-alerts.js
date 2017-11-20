define('ghost-admin/components/gh-alerts', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var observer = Ember.observer;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: 'aside',
        classNames: 'gh-alerts',

        notifications: service(),

        messages: alias('notifications.alerts'),

        messageCountObserver: observer('messages.[]', function () {
            this.sendAction('notify', this.get('messages').length);
        })
    });
});