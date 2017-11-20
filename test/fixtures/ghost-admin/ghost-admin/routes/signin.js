define('ghost-admin/routes/signin', ['exports', 'ember-data', 'ghost-admin/mixins/unauthenticated-route-mixin', 'ghost-admin/mixins/style-body'], function (exports, _emberData, _unauthenticatedRouteMixin, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var EmberObject = Ember.Object;
    var Route = Ember.Route;
    var Errors = _emberData.default.Errors;
    exports.default = Route.extend(_unauthenticatedRouteMixin.default, _styleBody.default, {
        titleToken: 'Sign In',

        classNames: ['ghost-login'],

        model: function model() {
            return EmberObject.create({
                identification: '',
                password: '',
                errors: Errors.create()
            });
        },


        // the deactivate hook is called after a route has been exited.
        deactivate: function deactivate() {
            var controller = this.controllerFor('signin');

            this._super.apply(this, arguments);

            // clear the properties that hold the credentials when we're no longer on the signin screen
            controller.set('model.identification', '');
            controller.set('model.password', '');
        }
    });
});