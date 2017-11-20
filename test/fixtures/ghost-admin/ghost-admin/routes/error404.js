define('ghost-admin/routes/error404', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    exports.default = Route.extend({
        controllerName: 'error',
        templateName: 'error',
        titleToken: 'Error',

        model: function model() {
            return {
                status: 404
            };
        }
    });
});