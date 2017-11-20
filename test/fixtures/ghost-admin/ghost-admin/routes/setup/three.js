define('ghost-admin/routes/setup/three', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    exports.default = Route.extend({
        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            if (!this.controllerFor('setup.two').get('blogCreated')) {
                this.transitionTo('setup.two');
            }
        }
    });
});