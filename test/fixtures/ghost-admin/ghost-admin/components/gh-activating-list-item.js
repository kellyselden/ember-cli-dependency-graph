define('ghost-admin/components/gh-activating-list-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var schedule = Ember.run.schedule;
    exports.default = Component.extend({
        tagName: 'li',
        classNameBindings: ['active'],
        active: false,
        linkClasses: null,

        click: function click() {
            this.$('a').blur();
        },


        actions: {
            setActive: function setActive(value) {
                schedule('afterRender', this, function () {
                    this.set('active', value);
                });
            }
        }
    });
});