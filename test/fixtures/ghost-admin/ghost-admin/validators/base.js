define('ghost-admin/validators/base', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var EmberObject = Ember.Object;
    exports.default = EmberObject.extend({
        properties: [],
        passed: false,

        /**
         * When passed a model and (optionally) a property name,
         * checks it against a list of validation functions
         * @param  {Ember.Object} model Model to validate
         * @param  {string} prop  Property name to check
         * @return {boolean}      True if the model passed all (or one) validation(s),
         *                        false if not
         */
        check: function check(model, prop) {
            var _this = this;

            this.set('passed', true);

            if (prop && this[prop]) {
                this[prop](model);
            } else {
                this.get('properties').forEach(function (property) {
                    if (_this[property]) {
                        _this[property](model);
                    }
                });
            }
            return this.get('passed');
        },
        invalidate: function invalidate() {
            this.set('passed', false);
        }
    });
});