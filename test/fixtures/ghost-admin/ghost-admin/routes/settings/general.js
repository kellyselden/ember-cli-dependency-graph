define('ghost-admin/routes/settings/general', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        config: service(),
        settings: service(),

        titleToken: 'Settings - General',
        classNames: ['settings-view-general'],

        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            return this.get('session.user').then(this.transitionAuthor()).then(this.transitionEditor());
        },
        model: function model() {
            return RSVP.hash({
                settings: this.get('settings').reload(),
                availableTimezones: this.get('config.availableTimezones')
            });
        },
        setupController: function setupController(controller, models) {
            // reset the leave setting transition
            controller.set('leaveSettingsTransition', null);
            controller.set('model', models.settings);
            controller.set('themes', this.get('store').peekAll('theme'));
            controller.set('availableTimezones', models.availableTimezones);
        },


        actions: {
            save: function save() {
                return this.get('controller').send('save');
            },
            reloadSettings: function reloadSettings() {
                return this.get('settings').reload();
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var model = controller.get('model');
                var modelIsDirty = model.get('hasDirtyAttributes');

                if (modelIsDirty) {
                    transition.abort();
                    controller.send('toggleLeaveSettingsModal', transition);
                    return;
                }
            }
        }
    });
});