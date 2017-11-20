define('ghost-admin/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin', 'ember-simple-auth/configuration', 'ghost-admin/mixins/shortcuts-route', 'ghost-admin/utils/ctrl-or-cmd', 'moment', 'ghost-admin/utils/window-proxy', 'ember-ajax/errors', 'ghost-admin/services/ajax'], function (exports, _applicationRouteMixin, _configuration, _shortcutsRoute, _ctrlOrCmd, _moment, _windowProxy, _errors, _ajax) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var RSVP = Ember.RSVP;
    var Route = Ember.Route;
    var htmlSafe = Ember.String.htmlSafe;
    var isEmberArray = Ember.isArray;
    var observer = Ember.observer;
    var run = Ember.run;
    var service = Ember.inject.service;


    function K() {
        return this;
    }

    var shortcuts = {};

    shortcuts.esc = { action: 'closeMenus', scope: 'default' };
    shortcuts[_ctrlOrCmd.default + '+s'] = { action: 'save', scope: 'all' };

    exports.default = Route.extend(_applicationRouteMixin.default, _shortcutsRoute.default, {
        shortcuts: shortcuts,

        routeAfterAuthentication: 'posts',

        config: service(),
        feature: service(),
        lazyLoader: service(),
        notifications: service(),
        settings: service(),
        upgradeNotification: service(),
        tour: service(),
        ui: service(),

        beforeModel: function beforeModel() {
            return this.get('config').fetch();
        },
        afterModel: function afterModel(model, transition) {
            var _this = this;

            this._super.apply(this, arguments);

            if (this.get('session.isAuthenticated')) {
                this.set('appLoadTransition', transition);
                transition.send('loadServerNotifications');
                transition.send('checkForOutdatedDesktopApp');

                // trigger a background token refresh to enable "infinite" sessions
                // NOTE: we only do this if the last refresh was > 1 day ago to avoid
                // potential issues with multiple tabs and concurrent admin loads/refreshes.
                // see https://github.com/TryGhost/Ghost/issues/8616
                var session = this.get('session.session');
                var expiresIn = session.get('authenticated.expires_in') * 1000;
                var expiresAt = session.get('authenticated.expires_at');
                var lastRefresh = (0, _moment.default)(expiresAt - expiresIn);
                var oneDayAgo = (0, _moment.default)().subtract(1, 'day');

                if (lastRefresh.isBefore(oneDayAgo)) {
                    var authenticator = session._lookupAuthenticator(session.authenticator);
                    if (authenticator && authenticator.onOnline) {
                        authenticator.onOnline();
                    }
                }

                var featurePromise = this.get('feature').fetch().then(function () {
                    if (_this.get('feature.nightShift')) {
                        return _this._setAdminTheme();
                    }
                });

                var settingsPromise = this.get('settings').fetch();
                var privateConfigPromise = this.get('config').fetchPrivate();
                var tourPromise = this.get('tour').fetchViewed();

                // return the feature/settings load promises so that we block until
                // they are loaded to enable synchronous access everywhere
                return RSVP.all([featurePromise, settingsPromise, privateConfigPromise, tourPromise]);
            }
        },
        title: function title(tokens) {
            return tokens.join(' - ') + ' - ' + this.get('config.blogTitle');
        },
        sessionAuthenticated: function sessionAuthenticated() {
            var _this2 = this;

            if (this.get('session.skipAuthSuccessHandler')) {
                return;
            }

            // standard ESA post-sign-in redirect
            this._super.apply(this, arguments);

            // trigger post-sign-in background behaviour
            this.get('session.user').then(function (user) {
                _this2.send('signedIn', user);
            });
        },
        sessionInvalidated: function sessionInvalidated() {
            var transition = this.get('appLoadTransition');

            if (transition) {
                transition.send('authorizationFailed');
            } else {
                run.scheduleOnce('routerTransitions', this, function () {
                    this.send('authorizationFailed');
                });
            }
        },


        _nightShift: observer('feature.nightShift', function () {
            this._setAdminTheme();
        }),

        _setAdminTheme: function _setAdminTheme() {
            var nightShift = this.get('feature.nightShift');

            return this.get('lazyLoader').loadStyle('dark', 'assets/ghost-dark.css', true).then(function () {
                $('link[title=dark]').prop('disabled', !nightShift);
                $('link[title=light]').prop('disabled', nightShift);
            });
        },


        actions: {
            closeMenus: function closeMenus() {
                this.get('ui').closeMenus();
            },
            didTransition: function didTransition() {
                this.set('appLoadTransition', null);
                this.send('closeMenus');
            },
            signedIn: function signedIn() {
                this.get('notifications').clearAll();
                this.send('loadServerNotifications', true);

                if (this.get('feature.nightShift')) {
                    this._setAdminTheme();
                }
            },
            invalidateSession: function invalidateSession() {
                var _this3 = this;

                this.get('session').invalidate().catch(function (error) {
                    _this3.get('notifications').showAlert(error.message, { type: 'error', key: 'session.invalidate.failed' });
                });
            },
            authorizationFailed: function authorizationFailed() {
                _windowProxy.default.replaceLocation(_configuration.default.baseURL);
            },
            loadServerNotifications: function loadServerNotifications(isDelayed) {
                var _this4 = this;

                if (this.get('session.isAuthenticated')) {
                    this.get('session.user').then(function (user) {
                        if (!user.get('isAuthor') && !user.get('isEditor')) {
                            _this4.store.findAll('notification', { reload: true }).then(function (serverNotifications) {
                                serverNotifications.forEach(function (notification) {
                                    if (notification.get('type') === 'upgrade') {
                                        _this4.get('upgradeNotification').set('content', notification.get('message'));
                                    } else {
                                        _this4.get('notifications').handleNotification(notification, isDelayed);
                                    }
                                });
                            });
                        }
                    });
                }
            },
            checkForOutdatedDesktopApp: function checkForOutdatedDesktopApp() {
                // Check if the user is running an older version of Ghost Desktop
                // that needs to be manually updated
                // (yes, the desktop team is deeply ashamed of these lines 😢)
                var ua = navigator && navigator.userAgent ? navigator.userAgent : null;

                if (ua && ua.includes && ua.includes('ghost-desktop')) {
                    var updateCheck = /ghost-desktop\/0\.((5\.0)|((4|2)\.0)|((3\.)(0|1)))/;
                    var link = '<a href="https://dev.ghost.org/ghost-desktop-manual-update" target="_blank">click here</a>';
                    var msg = 'Your version of Ghost Desktop needs to be manually updated. Please ' + link + ' to get started.';

                    if (updateCheck.test(ua)) {
                        this.get('notifications').showAlert(htmlSafe(msg), {
                            type: 'warn',
                            key: 'desktop.manual.upgrade'
                        });
                    }
                }
            },
            toggleMarkdownHelpModal: function toggleMarkdownHelpModal() {
                this.get('controller').toggleProperty('showMarkdownHelpModal');
            },


            // noop default for unhandled save (used from shortcuts)
            save: K,

            error: function error(_error, transition) {
                // unauthoirized errors are already handled in the ajax service
                if ((0, _errors.isUnauthorizedError)(_error)) {
                    return false;
                }

                if ((0, _errors.isNotFoundError)(_error)) {
                    if (transition) {
                        transition.abort();
                    }

                    var routeInfo = transition.handlerInfos[transition.handlerInfos.length - 1];
                    var router = this.get('router');
                    var params = [];

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Object.keys(routeInfo.params)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var key = _step.value;

                            params.push(routeInfo.params[key]);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return this.transitionTo('error404', router.generate.apply(router, [routeInfo.name].concat(params)).replace('/ghost/', '').replace(/^\//g, ''));
                }

                if ((0, _ajax.isVersionMismatchError)(_error)) {
                    if (transition) {
                        transition.abort();
                    }

                    this.get('upgradeStatus').requireUpgrade();
                    return false;
                }

                if ((0, _ajax.isMaintenanceError)(_error)) {
                    if (transition) {
                        transition.abort();
                    }

                    this.get('upgradeStatus').maintenanceAlert();
                    return false;
                }

                if ((0, _errors.isAjaxError)(_error) || _error && _error.payload && isEmberArray(_error.payload.errors)) {
                    this.get('notifications').showAPIError(_error);
                    // don't show the 500 page if we weren't navigating
                    if (!transition) {
                        return false;
                    }
                }

                // fallback to 500 error page
                return true;
            }
        }
    });
});