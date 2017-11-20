define('ghost-admin/routes/reset', ['exports', 'ghost-admin/mixins/unauthenticated-route-mixin', 'ghost-admin/mixins/style-body'], function (exports, _unauthenticatedRouteMixin, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    var service = Ember.inject.service;
    exports.default = Route.extend(_styleBody.default, _unauthenticatedRouteMixin.default, {
        classNames: ['ghost-reset'],

        notifications: service(),
        session: service(),

        beforeModel: function beforeModel() {
            if (this.get('session.isAuthenticated')) {
                this.get('notifications').showAlert('You can\'t reset your password while you\'re signed in.', { type: 'warn', delayed: true, key: 'password.reset.signed-in' });
            }

            this._super.apply(this, arguments);
        },
        setupController: function setupController(controller, params) {
            controller.token = params.token;
        },


        // Clear out any sensitive information
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.controller.clearData();
        }
    });
});