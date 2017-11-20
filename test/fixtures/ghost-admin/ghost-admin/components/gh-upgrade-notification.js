define('ghost-admin/components/gh-upgrade-notification', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: 'section',

        classNames: ['gh-upgrade-notification'],

        upgradeNotification: service('upgrade-notification'),

        message: alias('upgradeNotification.content')
    });
});