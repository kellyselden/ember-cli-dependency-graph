define('ghost-admin/controllers/team/user', ['exports', 'ghost-admin/utils/bound-one-way', 'ghost-admin/utils/isNumber', 'ghost-admin/utils/window-proxy', 'ember-concurrency'], function (exports, _boundOneWay, _isNumber, _windowProxy, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var Controller = Ember.Controller;
    var alias = Ember.computed.alias;
    var and = Ember.computed.and;
    var not = Ember.computed.not;
    var or = Ember.computed.or;
    var readOnly = Ember.computed.readOnly;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var isEmberArray = Ember.isArray;
    var run = Ember.run;
    var service = Ember.inject.service;
    var Handlebars = Ember.Handlebars;
    exports.default = Controller.extend({
        leaveSettingsTransition: null,
        dirtyAttributes: false,
        showDeleteUserModal: false,
        showSuspendUserModal: false,
        showTransferOwnerModal: false,
        showUploadCoverModal: false,
        showUplaodImageModal: false,
        _scratchFacebook: null,
        _scratchTwitter: null,

        ajax: service(),
        config: service(),
        dropdown: service(),
        ghostPaths: service(),
        notifications: service(),
        session: service(),
        slugGenerator: service(),

        user: alias('model'),
        currentUser: alias('session.user'),

        email: readOnly('model.email'),
        slugValue: (0, _boundOneWay.default)('model.slug'),

        canAssignRoles: or('currentUser.isAdmin', 'currentUser.isOwner'),
        canChangeEmail: not('isAdminUserOnOwnerProfile'),
        canChangePassword: not('isAdminUserOnOwnerProfile'),
        canMakeOwner: and('currentUser.isOwner', 'isNotOwnProfile', 'user.isAdmin'),
        isAdminUserOnOwnerProfile: and('currentUser.isAdmin', 'user.isOwner'),
        isNotOwnersProfile: not('user.isOwner'),
        rolesDropdownIsVisible: and('isNotOwnProfile', 'canAssignRoles', 'isNotOwnersProfile'),
        userActionsAreVisible: or('deleteUserActionIsVisible', 'canMakeOwner'),

        isOwnProfile: computed('user.id', 'currentUser.id', function () {
            return this.get('user.id') === this.get('currentUser.id');
        }),
        isNotOwnProfile: not('isOwnProfile'),

        deleteUserActionIsVisible: computed('currentUser', 'canAssignRoles', 'user', function () {
            if (this.get('canAssignRoles') && this.get('isNotOwnProfile') && !this.get('user.isOwner') || this.get('currentUser.isEditor') && (this.get('isNotOwnProfile') || this.get('user.isAuthor'))) {
                return true;
            }
        }),

        // duplicated in gh-user-active -- find a better home and consolidate?
        userDefault: computed('ghostPaths', function () {
            return this.get('ghostPaths.assetRoot') + '/img/user-image.png';
        }),

        userImageBackground: computed('user.profileImage', 'userDefault', function () {
            var url = this.get('user.profileImage') || this.get('userDefault');
            var safeUrl = Handlebars.Utils.escapeExpression(url);

            return htmlSafe('background-image: url(' + safeUrl + ')');
        }),
        // end duplicated

        coverDefault: computed('ghostPaths', function () {
            return this.get('ghostPaths.assetRoot') + '/img/user-cover.png';
        }),

        coverImageBackground: computed('user.coverImage', 'coverDefault', function () {
            var url = this.get('user.coverImage') || this.get('coverDefault');
            var safeUrl = Handlebars.Utils.escapeExpression(url);

            return htmlSafe('background-image: url(' + safeUrl + ')');
        }),

        coverTitle: computed('user.name', function () {
            return this.get('user.name') + '\'s Cover Image';
        }),

        roles: computed(function () {
            return this.store.query('role', { permissions: 'assign' });
        }),

        _deleteUser: function _deleteUser() {
            if (this.get('deleteUserActionIsVisible')) {
                var user = this.get('user');
                return user.destroyRecord();
            }
        },
        _deleteUserSuccess: function _deleteUserSuccess() {
            this.get('notifications').closeAlerts('user.delete');
            this.store.unloadAll('post');
            this.transitionToRoute('team');
        },
        _deleteUserFailure: function _deleteUserFailure() {
            this.get('notifications').showAlert('The user could not be deleted. Please try again.', { type: 'error', key: 'user.delete.failed' });
        },


        saveHandlers: (0, _emberConcurrency.taskGroup)().enqueue(),

        updateSlug: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newSlug) {
            var slug, serverSlug, slugTokens, check;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            slug = this.get('user.slug');


                            newSlug = newSlug || slug;
                            newSlug = newSlug.trim();

                            // Ignore unchanged slugs or candidate slugs that are empty

                            if (!(!newSlug || slug === newSlug)) {
                                _context.next = 6;
                                break;
                            }

                            this.set('slugValue', slug);

                            return _context.abrupt('return', true);

                        case 6:
                            _context.next = 8;
                            return this.get('slugGenerator').generateSlug('user', newSlug);

                        case 8:
                            serverSlug = _context.sent;

                            if (!(serverSlug === slug)) {
                                _context.next = 11;
                                break;
                            }

                            return _context.abrupt('return', true);

                        case 11:

                            // Because the server transforms the candidate slug by stripping
                            // certain characters and appending a number onto the end of slugs
                            // to enforce uniqueness, there are cases where we can get back a
                            // candidate slug that is a duplicate of the original except for
                            // the trailing incrementor (e.g., this-is-a-slug and this-is-a-slug-2)

                            // get the last token out of the slug candidate and see if it's a number
                            slugTokens = serverSlug.split('-');
                            check = Number(slugTokens.pop());

                            // if the candidate slug is the same as the existing slug except
                            // for the incrementor then the existing slug should be used

                            if (!((0, _isNumber.default)(check) && check > 0)) {
                                _context.next = 17;
                                break;
                            }

                            if (!(slug === slugTokens.join('-') && serverSlug !== newSlug)) {
                                _context.next = 17;
                                break;
                            }

                            this.set('slugValue', slug);

                            return _context.abrupt('return', true);

                        case 17:

                            this.set('slugValue', serverSlug);
                            this.set('dirtyAttributes', true);

                            return _context.abrupt('return', true);

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).group('saveHandlers'),

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var user, slugValue, slugChanged, model, currentPath, newPath;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            user = this.get('user');
                            slugValue = this.get('slugValue');
                            slugChanged = void 0;


                            if (user.get('slug') !== slugValue) {
                                slugChanged = true;
                                user.set('slug', slugValue);
                            }

                            _context2.prev = 4;
                            _context2.next = 7;
                            return user.save({ format: false });

                        case 7:
                            model = _context2.sent;
                            currentPath = void 0, newPath = void 0;

                            // If the user's slug has changed, change the URL and replace
                            // the history so refresh and back button still work

                            if (slugChanged) {
                                currentPath = window.location.hash;

                                newPath = currentPath.split('/');
                                newPath[newPath.length - 1] = model.get('slug');
                                newPath = newPath.join('/');

                                _windowProxy.default.replaceState({ path: newPath }, '', newPath);
                            }

                            this.set('dirtyAttributes', false);
                            this.get('notifications').closeAlerts('user.update');

                            return _context2.abrupt('return', model);

                        case 15:
                            _context2.prev = 15;
                            _context2.t0 = _context2['catch'](4);

                            // validation engine returns undefined so we have to check
                            // before treating the failure as an API error
                            if (_context2.t0) {
                                this.get('notifications').showAPIError(_context2.t0, { key: 'user.update' });
                            }

                        case 18:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[4, 15]]);
        })).group('saveHandlers'),

        actions: {
            changeRole: function changeRole(newRole) {
                this.get('user').set('role', newRole);
                this.set('dirtyAttributes', true);
            },
            deleteUser: function deleteUser() {
                var _this = this;

                return this._deleteUser().then(function () {
                    _this._deleteUserSuccess();
                }, function () {
                    _this._deleteUserFailure();
                });
            },
            toggleDeleteUserModal: function toggleDeleteUserModal() {
                if (this.get('deleteUserActionIsVisible')) {
                    this.toggleProperty('showDeleteUserModal');
                }
            },
            suspendUser: function suspendUser() {
                this.get('user').set('status', 'inactive');
                return this.get('save').perform();
            },
            toggleSuspendUserModal: function toggleSuspendUserModal() {
                if (this.get('deleteUserActionIsVisible')) {
                    this.toggleProperty('showSuspendUserModal');
                }
            },
            unsuspendUser: function unsuspendUser() {
                this.get('user').set('status', 'active');
                return this.get('save').perform();
            },
            toggleUnsuspendUserModal: function toggleUnsuspendUserModal() {
                if (this.get('deleteUserActionIsVisible')) {
                    this.toggleProperty('showUnsuspendUserModal');
                }
            },
            validateFacebookUrl: function validateFacebookUrl() {
                var newUrl = this.get('_scratchFacebook');
                var oldUrl = this.get('user.facebook');
                var errMessage = '';

                // reset errors and validation
                this.get('user.errors').remove('facebook');
                this.get('user.hasValidated').removeObject('facebook');

                if (newUrl === '') {
                    // Clear out the Facebook url
                    this.set('user.facebook', '');
                    return;
                }

                // _scratchFacebook will be null unless the user has input something
                if (!newUrl) {
                    newUrl = oldUrl;
                }

                try {
                    // strip any facebook URLs out
                    newUrl = newUrl.replace(/(https?:\/\/)?(www\.)?facebook\.com/i, '');

                    // don't allow any non-facebook urls
                    if (newUrl.match(/^(http|\/\/)/i)) {
                        throw 'invalid url';
                    }

                    // strip leading / if we have one then concat to full facebook URL
                    newUrl = newUrl.replace(/^\//, '');
                    newUrl = 'https://www.facebook.com/' + newUrl;

                    // don't allow URL if it's not valid
                    if (!validator.isURL(newUrl)) {
                        throw 'invalid url';
                    }

                    this.set('user.facebook', '');
                    run.schedule('afterRender', this, function () {
                        this.set('user.facebook', newUrl);
                    });
                } catch (e) {
                    if (e === 'invalid url') {
                        errMessage = 'The URL must be in a format like ' + 'https://www.facebook.com/yourPage';
                        this.get('user.errors').add('facebook', errMessage);
                        return;
                    }

                    throw e;
                } finally {
                    this.get('user.hasValidated').pushObject('facebook');
                }
            },
            validateTwitterUrl: function validateTwitterUrl() {
                var newUrl = this.get('_scratchTwitter');
                var oldUrl = this.get('user.twitter');
                var errMessage = '';

                // reset errors and validation
                this.get('user.errors').remove('twitter');
                this.get('user.hasValidated').removeObject('twitter');

                if (newUrl === '') {
                    // Clear out the Twitter url
                    this.set('user.twitter', '');
                    return;
                }

                // _scratchTwitter will be null unless the user has input something
                if (!newUrl) {
                    newUrl = oldUrl;
                }

                if (newUrl.match(/(?:twitter\.com\/)(\S+)/) || newUrl.match(/([a-z\d.]+)/i)) {
                    var username = [];

                    if (newUrl.match(/(?:twitter\.com\/)(\S+)/)) {
                        var _newUrl$match = newUrl.match(/(?:twitter\.com\/)(\S+)/);

                        var _newUrl$match2 = _slicedToArray(_newUrl$match, 2);

                        username = _newUrl$match2[1];
                    } else {
                        var _newUrl$match3 = newUrl.match(/([^/]+)\/?$/mi);

                        var _newUrl$match4 = _slicedToArray(_newUrl$match3, 1);

                        username = _newUrl$match4[0];
                    }

                    // check if username starts with http or www and show error if so
                    if (username.match(/^(http|www)|(\/)/) || !username.match(/^[a-z\d._]{1,15}$/mi)) {
                        errMessage = !username.match(/^[a-z\d._]{1,15}$/mi) ? 'Your Username is not a valid Twitter Username' : 'The URL must be in a format like https://twitter.com/yourUsername';

                        this.get('user.errors').add('twitter', errMessage);
                        this.get('user.hasValidated').pushObject('twitter');
                        return;
                    }

                    newUrl = 'https://twitter.com/' + username;

                    this.get('user.hasValidated').pushObject('twitter');

                    this.set('user.twitter', '');
                    run.schedule('afterRender', this, function () {
                        this.set('user.twitter', newUrl);
                    });
                } else {
                    errMessage = 'The URL must be in a format like ' + 'https://twitter.com/yourUsername';
                    this.get('user.errors').add('twitter', errMessage);
                    this.get('user.hasValidated').pushObject('twitter');
                    return;
                }
            },
            transferOwnership: function transferOwnership() {
                var _this2 = this;

                var user = this.get('user');
                var url = this.get('ghostPaths.url').api('users', 'owner');

                this.get('dropdown').closeDropdowns();

                return this.get('ajax').put(url, {
                    data: {
                        owner: [{
                            id: user.get('id')
                        }]
                    }
                }).then(function (response) {
                    // manually update the roles for the users that just changed roles
                    // because store.pushPayload is not working with embedded relations
                    if (response && isEmberArray(response.users)) {
                        response.users.forEach(function (userJSON) {
                            var user = _this2.store.peekRecord('user', userJSON.id);
                            var role = _this2.store.peekRecord('role', userJSON.roles[0].id);

                            user.set('role', role);
                        });
                    }

                    _this2.get('notifications').showAlert('Ownership successfully transferred to ' + user.get('name'), { type: 'success', key: 'owner.transfer.success' });
                }).catch(function (error) {
                    _this2.get('notifications').showAPIError(error, { key: 'owner.transfer' });
                });
            },
            toggleLeaveSettingsModal: function toggleLeaveSettingsModal(transition) {
                var leaveTransition = this.get('leaveSettingsTransition');

                if (!transition && this.get('showLeaveSettingsModal')) {
                    this.set('leaveSettingsTransition', null);
                    this.set('showLeaveSettingsModal', false);
                    return;
                }

                if (!leaveTransition || transition.targetName === leaveTransition.targetName) {
                    this.set('leaveSettingsTransition', transition);

                    // if a save is running, wait for it to finish then transition
                    if (this.get('saveHandlers.isRunning')) {
                        return this.get('saveHandlers.last').then(function () {
                            transition.retry();
                        });
                    }

                    // we genuinely have unsaved data, show the modal
                    this.set('showLeaveSettingsModal', true);
                }
            },
            leaveSettings: function leaveSettings() {
                var transition = this.get('leaveSettingsTransition');
                var user = this.get('user');

                if (!transition) {
                    this.get('notifications').showAlert('Sorry, there was an error in the application. Please let the Ghost team know what happened.', { type: 'error' });
                    return;
                }

                // roll back changes on model props
                user.rollbackAttributes();
                // roll back the slugValue property
                if (this.get('dirtyAttributes')) {
                    this.set('slugValue', user.get('slug'));
                    this.set('dirtyAttributes', false);
                }

                return transition.retry();
            },
            toggleTransferOwnerModal: function toggleTransferOwnerModal() {
                if (this.get('canMakeOwner')) {
                    this.toggleProperty('showTransferOwnerModal');
                }
            },
            toggleUploadCoverModal: function toggleUploadCoverModal() {
                this.toggleProperty('showUploadCoverModal');
            },
            toggleUploadImageModal: function toggleUploadImageModal() {
                this.toggleProperty('showUploadImageModal');
            },


            // TODO: remove those mutation actions once we have better
            // inline validations that auto-clear errors on input
            updatePassword: function updatePassword(password) {
                this.set('user.password', password);
                this.get('user.hasValidated').removeObject('password');
                this.get('user.errors').remove('password');
            },
            updateNewPassword: function updateNewPassword(password) {
                this.set('user.newPassword', password);
                this.get('user.hasValidated').removeObject('newPassword');
                this.get('user.errors').remove('newPassword');
            },
            updateNe2Password: function updateNe2Password(password) {
                this.set('user.ne2Password', password);
                this.get('user.hasValidated').removeObject('ne2Password');
                this.get('user.errors').remove('ne2Password');
            }
        }
    });
});