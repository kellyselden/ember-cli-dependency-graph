define('ghost-admin/models/user', ['exports', 'ember-data/model', 'ghost-admin/mixins/validation-engine', 'ember-data/attr', 'ember-data/relationships', 'ember-concurrency'], function (exports, _model, _validationEngine, _attr, _relationships, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    var equal = Ember.computed.equal;
    var service = Ember.inject.service;
    exports.default = _model.default.extend(_validationEngine.default, {
        validationType: 'user',

        name: (0, _attr.default)('string'),
        slug: (0, _attr.default)('string'),
        email: (0, _attr.default)('string'),
        profileImage: (0, _attr.default)('string'),
        coverImage: (0, _attr.default)('string'),
        bio: (0, _attr.default)('string'),
        website: (0, _attr.default)('string'),
        location: (0, _attr.default)('string'),
        accessibility: (0, _attr.default)('string'),
        status: (0, _attr.default)('string'),
        locale: (0, _attr.default)('string'),
        metaTitle: (0, _attr.default)('string'),
        metaDescription: (0, _attr.default)('string'),
        lastLoginUTC: (0, _attr.default)('moment-utc'),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        createdBy: (0, _attr.default)('number'),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        updatedBy: (0, _attr.default)('number'),
        roles: (0, _relationships.hasMany)('role', {
            embedded: 'always',
            async: false
        }),
        count: (0, _attr.default)('raw'),
        facebook: (0, _attr.default)('facebook-url-user'),
        twitter: (0, _attr.default)('twitter-url-user'),
        tour: (0, _attr.default)('json-string'),

        ghostPaths: service(),
        ajax: service(),
        session: service(),
        notifications: service(),
        config: service(),

        // TODO: Once client-side permissions are in place,
        // remove the hard role check.
        isAuthor: equal('role.name', 'Author'),
        isEditor: equal('role.name', 'Editor'),
        isAdmin: equal('role.name', 'Administrator'),
        isOwner: equal('role.name', 'Owner'),

        isLoggedIn: computed('id', 'session.user.id', function () {
            return this.get('id') === this.get('session.user.id');
        }),

        isActive: computed('status', function () {
            // TODO: review "locked" as an "active" status
            return ['active', 'warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'].indexOf(this.get('status')) > -1;
        }),

        isSuspended: equal('status', 'inactive'),
        isLocked: equal('status', 'locked'),

        role: computed('roles', {
            get: function get() {
                return this.get('roles.firstObject');
            },
            set: function set(key, value) {
                // Only one role per user, so remove any old data.
                this.get('roles').clear();
                this.get('roles').pushObject(value);

                return value;
            }
        }),

        saveNewPassword: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validation, url;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            validation = this.get('isLoggedIn') ? 'ownPasswordChange' : 'passwordChange';
                            _context.prev = 1;
                            _context.next = 4;
                            return this.validate({ property: validation });

                        case 4:
                            _context.next = 9;
                            break;

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context['catch'](1);
                            return _context.abrupt('return');

                        case 9:
                            _context.prev = 9;
                            url = this.get('ghostPaths.url').api('users', 'password');
                            _context.next = 13;
                            return this.get('ajax').put(url, {
                                data: {
                                    password: [{
                                        user_id: this.get('id'),
                                        oldPassword: this.get('password'),
                                        newPassword: this.get('newPassword'),
                                        ne2Password: this.get('ne2Password')
                                    }]
                                }
                            });

                        case 13:

                            this.setProperties({
                                password: '',
                                newPassword: '',
                                ne2Password: ''
                            });

                            this.get('notifications').showNotification('Password updated.', { type: 'success', key: 'user.change-password.success' });

                            // clear errors manually for ne2password because validation
                            // engine only clears the "validated proeprty"
                            // TODO: clean up once we have a better validations library
                            this.get('errors').remove('ne2Password');

                            return _context.abrupt('return', true);

                        case 19:
                            _context.prev = 19;
                            _context.t1 = _context['catch'](9);

                            this.get('notifications').showAPIError(_context.t1, { key: 'user.change-password' });

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 6], [9, 19]]);
        })).drop()
    });
});