define('ghost-admin/components/gh-alert', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: 'article',
        classNames: ['gh-alert'],
        classNameBindings: ['typeClass'],

        notifications: service(),

        typeClass: computed('message.type', function () {
            var type = this.get('message.type');
            var classes = '';
            var typeMapping = void 0;

            typeMapping = {
                success: 'green',
                error: 'red',
                warn: 'blue',
                info: 'blue'
            };

            if (typeMapping[type] !== undefined) {
                classes += 'gh-alert-' + typeMapping[type];
            }

            return classes;
        }),

        actions: {
            closeNotification: function closeNotification() {
                this.get('notifications').closeNotification(this.get('message'));
            }
        }
    });
});