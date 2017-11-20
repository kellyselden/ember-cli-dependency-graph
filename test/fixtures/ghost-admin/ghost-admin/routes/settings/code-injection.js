define('ghost-admin/routes/settings/code-injection', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        titleToken: 'Settings - Code injection',
        classNames: ['settings-view-code'],

        settings: service(),

        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            return this.get('session.user').then(this.transitionAuthor()).then(this.transitionEditor());
        },
        model: function model() {
            return this.get('settings').reload();
        },


        actions: {
            save: function save() {
                this.get('controller').send('save');
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var settings = this.get('settings');
                var modelIsDirty = settings.get('hasDirtyAttributes');

                if (modelIsDirty) {
                    transition.abort();
                    controller.send('toggleLeaveSettingsModal', transition);
                    return;
                }
            }
        }
    });
});