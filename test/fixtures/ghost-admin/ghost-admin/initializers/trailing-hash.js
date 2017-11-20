define('ghost-admin/initializers/trailing-hash', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var HashLocation = Ember.HashLocation;


    var trailingHash = HashLocation.extend({
        formatURL: function formatURL() {
            var url = this._super.apply(this, arguments);

            if (url.indexOf('?') > 0) {
                return url.replace(/([^/])\?/, '$1/?');
            } else {
                return url.replace(/\/?$/, '/');
            }
        }
    });

    exports.default = {
        name: 'registerTrailingHashLocation',

        initialize: function initialize(application) {
            application.register('location:trailing-hash', trailingHash);
        }
    };
});