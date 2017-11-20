define('ghost-admin/routes/signout', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    var canInvoke = Ember.canInvoke;
    exports.default = _authenticated.default.extend(_styleBody.default, {
        titleToken: 'Sign Out',

        classNames: ['ghost-signout'],

        notifications: service(),

        afterModel: function afterModel(model, transition) {
            this.get('notifications').clearAll();
            if (canInvoke(transition, 'send')) {
                transition.send('invalidateSession');
            } else {
                this.send('invalidateSession');
            }
        }
    });
});