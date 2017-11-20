define('ghost-admin/components/gh-validation-status-container', ['exports', 'ghost-admin/mixins/validation-state'], function (exports, _validationState) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    exports.default = Component.extend(_validationState.default, {
        classNameBindings: ['errorClass'],

        errorClass: computed('property', 'hasError', 'hasValidated.[]', function () {
            var hasValidated = this.get('hasValidated');
            var property = this.get('property');

            if (hasValidated && hasValidated.includes(property)) {
                return this.get('hasError') ? 'error' : 'success';
            } else {
                return '';
            }
        })
    });
});