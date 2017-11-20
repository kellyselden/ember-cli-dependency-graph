define('ghost-admin/controllers/error', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    exports.default = Controller.extend({

        stack: false,

        code: computed('model.status', function () {
            return this.get('model.status') > 200 ? this.get('model.status') : 500;
        }),

        message: computed('model.statusText', function () {
            if (this.get('code') === 404) {
                return 'Page not found';
            }

            return this.get('model.statusText') !== 'error' ? this.get('model.statusText') : 'Internal Server Error';
        })
    });
});