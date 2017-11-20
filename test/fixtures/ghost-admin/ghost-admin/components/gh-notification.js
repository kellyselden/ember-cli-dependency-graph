define('ghost-admin/components/gh-notification', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: 'article',
        classNames: ['gh-notification', 'gh-notification-passive'],
        classNameBindings: ['typeClass'],

        message: null,

        notifications: service(),

        typeClass: computed('message.type', function () {
            var type = this.get('message.type');
            var classes = '';
            var typeMapping = void 0;

            typeMapping = {
                success: 'green',
                error: 'red',
                warn: 'yellow'
            };

            if (typeMapping[type] !== undefined) {
                classes += 'gh-notification-' + typeMapping[type];
            }

            return classes;
        }),

        didInsertElement: function didInsertElement() {
            var _this = this;

            this._super.apply(this, arguments);

            this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (event) {
                if (event.originalEvent.animationName === 'fade-out') {
                    _this.get('notifications').closeNotification(_this.get('message'));
                }
            });
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            this.$().off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
        },


        actions: {
            closeNotification: function closeNotification() {
                this.get('notifications').closeNotification(this.get('message'));
            }
        }
    });
});