define('ghost-admin/components/gh-app', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Component = Ember.Component;
    exports.default = Component.extend({
        classNames: ['gh-app'],

        showSettingsMenu: false,

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);
            var showSettingsMenu = this.get('showSettingsMenu');

            $('body').toggleClass('settings-menu-expanded', showSettingsMenu);
        }
    });
});