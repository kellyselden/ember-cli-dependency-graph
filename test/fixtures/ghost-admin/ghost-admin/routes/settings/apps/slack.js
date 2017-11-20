define('ghost-admin/routes/settings/apps/slack', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, {
        titleToken: 'Settings - Apps - Slack',

        classNames: ['settings-view-apps-slack'],

        settings: service(),

        afterModel: function afterModel() {
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