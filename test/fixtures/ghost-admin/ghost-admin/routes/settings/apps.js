define('ghost-admin/routes/settings/apps', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        settings: service(),

        titleToken: 'Settings - Apps',
        classNames: ['settings-view-apps'],

        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            return this.get('session.user').then(this.transitionAuthor()).then(this.transitionEditor());
        },


        // we don't want to set the model property but we do want to ensure we have
        // up-to-date settings so pause via afterModel
        afterModel: function afterModel() {
            return this.get('settings').reload();
        }
    });
});