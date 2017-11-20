define('ghost-admin/routes/subscribers/import', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    exports.default = Route.extend({
        actions: {
            cancel: function cancel() {
                this.transitionTo('subscribers');
            }
        }
    });
});