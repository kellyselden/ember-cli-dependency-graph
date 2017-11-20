define('ghost-admin/mixins/settings-menu-component', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var computed = Ember.computed;
    exports.default = Mixin.create({
        showSettingsMenu: false,

        isViewingSubview: computed('showSettingsMenu', {
            get: function get() {
                return false;
            },
            set: function set(key, value) {
                // Not viewing a subview if we can't even see the PSM
                if (!this.get('showSettingsMenu')) {
                    return false;
                }
                return value;
            }
        }),

        actions: {
            showSubview: function showSubview() {
                this.set('isViewingSubview', true);
            },
            closeSubview: function closeSubview() {
                this.set('isViewingSubview', false);
            }
        }
    });
});