define('ghost-admin/utils/bound-one-way', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (upstream, transform) {
        if (typeof transform !== 'function') {
            // default to the identity function
            transform = function transform(value) {
                return value;
            };
        }

        return computed(upstream, {
            get: function get() {
                return transform(this.get(upstream));
            },
            set: function set(key, value) {
                return value;
            }
        });
    };

    var computed = Ember.computed;
});