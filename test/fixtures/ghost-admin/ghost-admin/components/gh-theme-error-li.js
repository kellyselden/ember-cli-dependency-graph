define('ghost-admin/components/gh-theme-error-li', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({
        tagName: '',
        error: null,
        showDetails: false,

        actions: {
            toggleDetails: function toggleDetails() {
                this.toggleProperty('showDetails');
            }
        }
    });
});