define('ghost-admin/components/gh-trim-focus-input', ['exports', 'ghost-admin/components/gh-input'], function (exports, _ghInput) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    /**
     * This doesn't override the OneWayInput component because
     * we need finer control. It borrows
     * parts from both the OneWayInput component and Ember's default
     * input component
     */
    var TrimFocusInputComponent = _ghInput.default.extend({

        shouldFocus: true,

        focusOut: function focusOut(event) {
            this._trimInput(event.target.value);
        },
        _trimInput: function _trimInput(value) {
            if (value && typeof value.trim === 'function') {
                value = value.trim();
            }

            this._processNewValue(value);
        }
    });

    exports.default = TrimFocusInputComponent;
});