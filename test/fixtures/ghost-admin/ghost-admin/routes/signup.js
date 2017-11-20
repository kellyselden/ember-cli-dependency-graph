define('ghost-admin/routes/signup', ['exports', 'ember-data', 'ghost-admin/mixins/unauthenticated-route-mixin', 'ghost-admin/mixins/style-body'], function (exports, _emberData, _unauthenticatedRouteMixin, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var EmberObject = Ember.Object;
    var RSVP = Ember.RSVP;
    var Route = Ember.Route;
    var service = Ember.inject.service;
    var Promise = RSVP.Promise;
    var Errors = _emberData.default.Errors;
    exports.default = Route.extend(_styleBody.default, _unauthenticatedRouteMixin.default, {
        classNames: ['ghost-signup'],

        ghostPaths: service(),
        notifications: service(),
        session: service(),
        ajax: service(),
        config: service(),

        beforeModel: function beforeModel() {
            if (this.get('session.isAuthenticated')) {
                this.get('notifications').showAlert('You need to sign out to register as a new user.', { type: 'warn', delayed: true, key: 'signup.create.already-authenticated' });
            }

            this._super.apply(this, arguments);
        },
        model: function model(params) {
            var _this = this;

            var model = EmberObject.create();
            var re = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}|[A-Za-z0-9_-]{3})?$/;
            var email = void 0,
                tokenText = void 0;

            return new Promise(function (resolve) {
                if (!re.test(params.token)) {
                    _this.get('notifications').showAlert('Invalid token.', { type: 'error', delayed: true, key: 'signup.create.invalid-token' });

                    return resolve(_this.transitionTo('signin'));
                }

                tokenText = atob(params.token);
                email = tokenText.split('|')[1];

                model.set('email', email);
                model.set('token', params.token);
                model.set('errors', Errors.create());

                var authUrl = _this.get('ghostPaths.url').api('authentication', 'invitation');

                return _this.get('ajax').request(authUrl, {
                    dataType: 'json',
                    data: {
                        email: email
                    }
                }).then(function (response) {
                    if (response && response.invitation && response.invitation[0].valid === false) {
                        _this.get('notifications').showAlert('The invitation does not exist or is no longer valid.', { type: 'warn', delayed: true, key: 'signup.create.invalid-invitation' });

                        return resolve(_this.transitionTo('signin'));
                    }

                    model.set('invitedBy', response.invitation[0].invitedBy);

                    // set blogTitle, so password validation has access to it
                    model.set('blogTitle', _this.get('config.blogTitle'));

                    resolve(model);
                }).catch(function () {
                    resolve(model);
                });
            });
        },
        deactivate: function deactivate() {
            this._super.apply(this, arguments);

            // clear the properties that hold the sensitive data from the controller
            this.controllerFor('signup').setProperties({ email: '', password: '', token: '' });
        }
    });
});