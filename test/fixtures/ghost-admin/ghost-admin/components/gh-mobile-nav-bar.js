define('ghost-admin/components/gh-mobile-nav-bar', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        ui: service(),

        tagName: 'nav',
        classNames: ['gh-mobile-nav-bar']
    });
});