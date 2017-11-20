define('ghost-admin/mixins/text-input', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var computed = Ember.computed;
    exports.default = Mixin.create({
        attributeBindings: ['autofocus'],

        selectOnClick: false,
        shouldFocus: false,
        stopEnterKeyDownPropagation: false,

        autofocus: computed(function () {
            if (this.get('shouldFocus')) {
                return device.ios() ? false : 'autofocus';
            }

            return false;
        }),

        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this._focus();
        },
        click: function click(event) {
            if (this.get('selectOnClick')) {
                event.currentTarget.select();
            }
        },
        keyDown: function keyDown(event) {
            // stop event propagation when pressing "enter"
            // most useful in the case when undesired (global) keyboard shortcuts
            // are getting triggered while interacting with this particular input element.
            if (this.get('stopEnterKeyDownPropagation') && event.keyCode === 13) {
                event.stopPropagation();

                return true;
            }

            // prevent default TAB behaviour if we have a keyEvent for it
            if (event.keyCode === 9 && typeof this.get('keyEvents.9') === 'function') {
                event.preventDefault();
            }

            this._super.apply(this, arguments);
        },
        keyPress: function keyPress(event) {
            // prevent default ENTER behaviour if we have a keyEvent for it
            if (event.keyCode === 13 && typeof this.get('keyEvents.13') === 'function') {
                event.preventDefault();
            }

            this._super.apply(this, arguments);
        },
        _focus: function _focus() {
            // Until mobile safari has better support
            // for focusing, we just ignore it
            if (this.get('shouldFocus') && !device.ios()) {
                this.element.focus();
            }
        }
    });
});