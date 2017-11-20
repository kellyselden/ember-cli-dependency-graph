define('ghost-admin/routes/settings/apps/unsplash', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/models/unsplash-integration', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _unsplashIntegration, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, {
        config: service(),
        settings: service(),

        titleToken: 'Settings - Apps - Unsplash',
        classNames: ['settings-view-apps-unsplash'],

        beforeModel: function beforeModel() {
            var settings = this.get('settings');

            if (settings.get('unsplash')) {
                return;
            }

            // server doesn't have any unsplash settings by default but it can provide
            // overrides via config:
            // - isActive: use as default but allow settings override
            // - applicationId: total override, no field is shown if present
            var unsplash = _unsplashIntegration.default.create({
                isActive: true
            });

            settings.set('unsplash', unsplash);

            return unsplash;
        },


        actions: {
            save: function save() {
                this.get('controller').send('save');
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var modelIsDirty = controller.get('dirtyAttributes');

                if (modelIsDirty) {
                    transition.abort();
                    controller.send('toggleLeaveSettingsModal', transition);
                    return;
                }
            }
        }
    });
});