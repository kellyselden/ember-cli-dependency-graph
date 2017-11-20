define('ghost-admin/components/gh-content-cover', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        ui: service(),

        classNames: ['content-cover'],

        onMouseEnter: null,

        click: function click() {
            this.get('ui').closeMenus();
        },
        mouseEnter: function mouseEnter() {
            this.get('ui').closeAutoNav();
        }
    });
});