define('ghost-admin/mixins/validation-state', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var emberA = Ember.A;
    var isEmpty = Ember.isEmpty;
    var observer = Ember.observer;
    var run = Ember.run;
    exports.default = Mixin.create({

        errors: null,
        property: '',
        hasValidated: emberA(),

        hasError: false,

        setHasError: function setHasError() {
            var property = this.get('property');
            var errors = this.get('errors');
            var hasValidated = this.get('hasValidated');

            // if we aren't looking at a specific property we always want an error class
            if (!property && errors && !errors.get('isEmpty')) {
                this.set('hasError', true);
                return;
            }

            // If we haven't yet validated this field, there is no validation class needed
            if (!hasValidated || !hasValidated.includes(property)) {
                this.set('hasError', false);
                return;
            }

            if (errors && !isEmpty(errors.errorsFor(property))) {
                this.set('hasError', true);
                return;
            }

            this.set('hasError', false);
        },


        hasErrorObserver: observer('errors.[]', 'property', 'hasValidated.[]', function () {
            run.once(this, 'setHasError');
            // this.setHasError();
        }).on('init')

    });
});