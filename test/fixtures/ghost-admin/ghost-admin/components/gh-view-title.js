define('ghost-admin/components/gh-view-title', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        ui: service(),

        tagName: 'h2',
        classNames: ['view-title']
    });
});