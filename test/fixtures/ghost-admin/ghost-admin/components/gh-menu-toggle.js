define('ghost-admin/components/gh-menu-toggle', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var reads = Ember.computed.reads;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        classNames: ['gh-menu-toggle'],

        mediaQueries: service(),
        isMobile: reads('mediaQueries.isMobile'),
        maximise: false,

        // closure actions
        desktopAction: function desktopAction() {},
        mobileAction: function mobileAction() {},


        iconClass: computed('maximise', 'isMobile', function () {
            if (this.get('maximise') && !this.get('isMobile')) {
                return 'icon-maximise';
            } else {
                return 'icon-minimise';
            }
        }),

        click: function click() {
            if (this.get('isMobile')) {
                this.mobileAction();
            } else {
                this.toggleProperty('maximise');
                this.desktopAction();
            }
        }
    });
});