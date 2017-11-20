define('ghost-admin/routes/settings/design', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var RSVP = Ember.RSVP;
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        settings: service(),

        titleToken: 'Settings - Design',
        classNames: ['settings-view-design'],

        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            return this.get('session.user').then(this.transitionAuthor());
        },
        model: function model() {
            return RSVP.hash({
                settings: this.get('settings').reload(),
                themes: this.get('store').findAll('theme')
            });
        },
        setupController: function setupController(controller, models) {
            // reset the leave setting transition
            controller.set('leaveSettingsTransition', null);
            controller.set('model', models.settings);
            controller.set('themes', this.get('store').peekAll('theme'));
            this.get('controller').send('reset');
        },


        actions: {
            save: function save() {
                // since shortcuts are run on the route, we have to signal to the components
                // on the page that we're about to save.
                $('.page-actions .gh-btn-blue').focus();

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
            },
            activateTheme: function activateTheme(theme) {
                return this.get('controller').send('activateTheme', theme);
            }
        }
    });
});