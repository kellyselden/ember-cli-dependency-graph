define('ghost-admin/routes/settings/apps/amp', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend(_styleBody.default, {
        titleToken: 'Settings - Apps - AMP',

        classNames: ['settings-view-apps-amp'],

        actions: {
            save: function save() {
                this.get('controller').send('save');
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var settings = controller.get('settings');
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