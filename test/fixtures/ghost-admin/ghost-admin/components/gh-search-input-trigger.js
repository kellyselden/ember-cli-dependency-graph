define('ghost-admin/components/gh-search-input-trigger', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var isBlank = Ember.isBlank;
    exports.default = Component.extend({
        open: function open() {
            this.get('select.actions').open();
        },
        close: function close() {
            this.get('select.actions').close();
        },
        _focusInput: function _focusInput() {
            this.$('input')[0].focus();
        },


        actions: {
            captureMouseDown: function captureMouseDown(e) {
                e.stopPropagation();
            },
            search: function search(term) {
                // open dropdown if not open and term is present
                // close dropdown if open and term is blank
                if (isBlank(term) === this.get('select.isOpen')) {
                    isBlank(term) ? this.close() : this.open();

                    // ensure focus isn't lost when dropdown is closed
                    if (isBlank(term)) {
                        this._focusInput();
                    }
                }

                this.get('select').actions.search(term);
            },
            focusInput: function focusInput() {
                this._focusInput();
            },
            resetInput: function resetInput() {
                this.$('input').val('');
            },
            handleKeydown: function handleKeydown(e) {
                var select = this.get('select');

                // TODO: remove keycode check once EPS is updated to 1.0
                if (!select.isOpen || e.keyCode === 32) {
                    e.stopPropagation();
                }
            }
        }
    });
});