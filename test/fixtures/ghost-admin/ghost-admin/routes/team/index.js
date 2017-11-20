define('ghost-admin/routes/team/index', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ember-infinity/mixins/route', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _currentUserSettings, _route, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    exports.default = _authenticated.default.extend(_styleBody.default, _currentUserSettings.default, _route.default, {
        titleToken: 'Team',

        classNames: ['view-team'],

        modelPath: 'controller.activeUsers',
        perPage: 15,
        perPageParam: 'limit',
        totalPagesParam: 'meta.pagination.pages',

        model: function model() {
            var _this = this;

            return this.get('session.user').then(function (user) {
                var modelPath = _this.get('modelPath');
                var perPage = _this.get('perPage');

                var modelPromises = {
                    activeUsers: _this.infinityModel('user', {
                        modelPath: modelPath,
                        perPage: perPage,
                        filter: 'status:-inactive',
                        startingPage: 1
                    })
                };

                // authors do not have permission to hit the invites or suspended users endpoint
                if (!user.get('isAuthor')) {
                    modelPromises.invites = _this.store.query('invite', { limit: 'all' }).then(function () {
                        return _this.store.filter('invite', function (invite) {
                            return !invite.get('isNew');
                        });
                    });

                    // fetch suspended users separately so that infinite scroll still works
                    modelPromises.suspendedUsers = _this.store.query('user', { limit: 'all', filter: 'status:inactive' });
                }

                // we need to load the roles into ember cache
                // invites return role_id only and we do not offer a /role/:id endpoint
                modelPromises.roles = _this.get('store').query('role', {}).then(function (roles) {
                    return roles;
                });

                return RSVP.hash(modelPromises);
            });
        },
        setupController: function setupController(controller, models) {
            controller.setProperties(models);
        },


        actions: {
            reload: function reload() {
                this.refresh();
            }
        }
    });
});