define('ghost-admin/routes/team/user', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, {
        titleToken: 'Team - User',

        classNames: ['team-view-user'],

        model: function model(params) {
            return this.store.queryRecord('user', { slug: params.user_slug, include: 'count.posts' });
        },
        serialize: function serialize(model) {
            return { user_slug: model.get('slug') };
        },
        afterModel: function afterModel(user) {
            var _this = this;

            this._super.apply(this, arguments);

            return this.get('session.user').then(function (currentUser) {
                var isOwnProfile = user.get('id') === currentUser.get('id');
                var isAuthor = currentUser.get('isAuthor');
                var isEditor = currentUser.get('isEditor');

                if (isAuthor && !isOwnProfile) {
                    _this.transitionTo('team.user', currentUser);
                } else if (isEditor && !isOwnProfile && !user.get('isAuthor')) {
                    _this.transitionTo('team');
                }
            });
        },


        actions: {
            didTransition: function didTransition() {
                this.modelFor('team.user').get('errors').clear();
            },
            save: function save() {
                this.get('controller.save').perform();
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var user = controller.get('user');
                var dirtyAttributes = controller.get('dirtyAttributes');
                var modelIsDirty = user.get('hasDirtyAttributes');

                // always reset the password properties on the user model when leaving
                if (user) {
                    user.set('password', '');
                    user.set('newPassword', '');
                    user.set('ne2Password', '');
                }

                if (modelIsDirty || dirtyAttributes) {
                    transition.abort();
                    controller.send('toggleLeaveSettingsModal', transition);
                    return;
                }
            }
        }
    });
});