define('ghost-admin/components/gh-dropdown-button', ['exports', 'ghost-admin/mixins/dropdown-mixin'], function (exports, _dropdownMixin) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend(_dropdownMixin.default, {
        tagName: 'button',
        attributeBindings: ['href', 'role'],
        role: 'button',

        // matches with the dropdown this button toggles
        dropdownName: null,

        dropdown: service(),

        // Notify dropdown service this dropdown should be toggled
        click: function click(event) {
            this._super(event);
            this.get('dropdown').toggleDropdown(this.get('dropdownName'), this);

            if (this.get('tagName') === 'a') {
                return false;
            }
        }
    });
});