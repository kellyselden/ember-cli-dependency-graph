define('ghost-admin/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = _session.default.extend({
        feature: service(),
        store: service(),
        tour: service(),

        user: computed(function () {
            return this.get('store').queryRecord('user', { id: 'me' });
        }),

        authenticate: function authenticate() {
            var _this = this;

            return this._super.apply(this, arguments).then(function (authResult) {
                // TODO: remove duplication with application.afterModel
                var preloadPromises = [_this.get('feature').fetch(), _this.get('tour').fetchViewed()];

                return RSVP.all(preloadPromises).then(function () {
                    return authResult;
                });
            });
        }
    });
});