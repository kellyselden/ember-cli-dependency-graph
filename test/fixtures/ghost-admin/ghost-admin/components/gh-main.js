define('ghost-admin/components/gh-main', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({
        tagName: 'main',
        classNames: ['gh-main'],
        ariaRole: 'main',

        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        }
    });
});