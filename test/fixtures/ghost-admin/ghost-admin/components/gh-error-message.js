define('ghost-admin/components/gh-error-message', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var notEmpty = Ember.computed.notEmpty;
    exports.default = Component.extend({
        tagName: 'p',
        classNames: ['response'],

        errors: null,
        property: '',

        isVisible: notEmpty('errors'),

        message: computed('errors.[]', 'property', function () {
            var property = this.get('property');
            var errors = this.get('errors');
            var messages = [];
            var index = void 0;

            if (!isEmpty(errors) && errors.get(property)) {
                errors.get(property).forEach(function (error) {
                    messages.push(error);
                });
                index = Math.floor(Math.random() * messages.length);
                return messages[index].message;
            }
        })
    });
});