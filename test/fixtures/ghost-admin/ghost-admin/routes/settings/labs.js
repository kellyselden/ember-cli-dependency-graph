define('ghost-admin/routes/settings/labs', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        settings: service(),

        titleToken: 'Settings - Labs',
        classNames: ['settings'],

        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            return this.get('session.user').then(this.transitionAuthor()).then(this.transitionEditor());
        },
        model: function model() {
            return this.get('settings').reload();
        },
        resetController: function resetController(controller, isExiting) {
            if (isExiting) {
                controller.reset();
            }
        }
    });
});