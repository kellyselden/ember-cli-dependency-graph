define('ghost-admin/components/gh-search-input', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.computedGroup = computedGroup;
    var Component = Ember.Component;
    var RSVP = Ember.RSVP;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    var isEmpty = Ember.isEmpty;
    var run = Ember.run;
    var service = Ember.inject.service;
    function computedGroup(category) {
        return computed('content', 'currentSearch', function () {
            var _this = this;

            if (!this.get('currentSearch') || !this.get('content')) {
                return [];
            }

            return this.get('content').filter(function (item) {
                var search = _this.get('currentSearch').toString().toLowerCase();

                return item.category === category && item.title.toString().toLowerCase().indexOf(search) >= 0;
            });
        });
    }

    exports.default = Component.extend({

        selection: null,
        content: [],
        isLoading: false,
        contentExpiry: 10 * 1000,
        contentExpiresAt: false,
        currentSearch: '',

        posts: computedGroup('Stories'),
        pages: computedGroup('Pages'),
        users: computedGroup('Users'),
        tags: computedGroup('Tags'),

        _store: service('store'),
        router: service('router'),
        ajax: service(),
        notifications: service(),

        refreshContent: function refreshContent() {
            var _this2 = this;

            var promises = [];
            var now = new Date();
            var contentExpiry = this.get('contentExpiry');
            var contentExpiresAt = this.get('contentExpiresAt');

            if (this.get('isLoading') || contentExpiresAt > now) {
                return RSVP.resolve();
            }

            this.set('isLoading', true);
            this.set('content', []);
            promises.pushObject(this._loadPosts());
            promises.pushObject(this._loadUsers());
            promises.pushObject(this._loadTags());

            return RSVP.all(promises).then(function () {}).finally(function () {
                _this2.set('isLoading', false);
                _this2.set('contentExpiresAt', new Date(now.getTime() + contentExpiry));
            });
        },


        groupedContent: computed('posts', 'pages', 'users', 'tags', function () {
            var groups = [];

            if (!isEmpty(this.get('posts'))) {
                groups.pushObject({ groupName: 'Stories', options: this.get('posts') });
            }

            if (!isEmpty(this.get('pages'))) {
                groups.pushObject({ groupName: 'Pages', options: this.get('pages') });
            }

            if (!isEmpty(this.get('users'))) {
                groups.pushObject({ groupName: 'Users', options: this.get('users') });
            }

            if (!isEmpty(this.get('tags'))) {
                groups.pushObject({ groupName: 'Tags', options: this.get('tags') });
            }

            return groups;
        }),

        _loadPosts: function _loadPosts() {
            var _this3 = this;

            var store = this.get('_store');
            var postsUrl = store.adapterFor('post').urlForQuery({}, 'post') + '/';
            var postsQuery = { fields: 'id,title,page', limit: 'all', status: 'all', staticPages: 'all' };
            var content = this.get('content');

            return this.get('ajax').request(postsUrl, { data: postsQuery }).then(function (posts) {
                content.pushObjects(posts.posts.map(function (post) {
                    return {
                        id: 'post.' + post.id,
                        title: post.title,
                        category: post.page ? 'Pages' : 'Stories'
                    };
                }));
            }).catch(function (error) {
                _this3.get('notifications').showAPIError(error, { key: 'search.loadPosts.error' });
            });
        },
        _loadUsers: function _loadUsers() {
            var _this4 = this;

            var store = this.get('_store');
            var usersUrl = store.adapterFor('user').urlForQuery({}, 'user') + '/';
            var usersQuery = { fields: 'name,slug', limit: 'all' };
            var content = this.get('content');

            return this.get('ajax').request(usersUrl, { data: usersQuery }).then(function (users) {
                content.pushObjects(users.users.map(function (user) {
                    return {
                        id: 'user.' + user.slug,
                        title: user.name,
                        category: 'Users'
                    };
                }));
            }).catch(function (error) {
                _this4.get('notifications').showAPIError(error, { key: 'search.loadUsers.error' });
            });
        },
        _loadTags: function _loadTags() {
            var _this5 = this;

            var store = this.get('_store');
            var tagsUrl = store.adapterFor('tag').urlForQuery({}, 'tag') + '/';
            var tagsQuery = { fields: 'name,slug', limit: 'all' };
            var content = this.get('content');

            return this.get('ajax').request(tagsUrl, { data: tagsQuery }).then(function (tags) {
                content.pushObjects(tags.tags.map(function (tag) {
                    return {
                        id: 'tag.' + tag.slug,
                        title: tag.name,
                        category: 'Tags'
                    };
                }));
            }).catch(function (error) {
                _this5.get('notifications').showAPIError(error, { key: 'search.loadTags.error' });
            });
        },
        _performSearch: function _performSearch(term, resolve, reject) {
            var _this6 = this;

            if (isBlank(term)) {
                return resolve([]);
            }

            this.refreshContent().then(function () {
                _this6.set('currentSearch', term);

                return resolve(_this6.get('groupedContent'));
            }).catch(reject);
        },
        _setKeymasterScope: function _setKeymasterScope() {
            key.setScope('search-input');
        },
        _resetKeymasterScope: function _resetKeymasterScope() {
            key.setScope('default');
        },
        willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            this._resetKeymasterScope();
        },


        actions: {
            openSelected: function openSelected(selected) {
                if (!selected) {
                    return;
                }

                if (selected.category === 'Stories' || selected.category === 'Pages') {
                    var id = selected.id.replace('post.', '');
                    this.get('router').transitionTo('editor.edit', id);
                }

                if (selected.category === 'Users') {
                    var _id = selected.id.replace('user.', '');
                    this.get('router').transitionTo('team.user', _id);
                }

                if (selected.category === 'Tags') {
                    var _id2 = selected.id.replace('tag.', '');
                    this.get('router').transitionTo('settings.tags.tag', _id2);
                }
            },
            onFocus: function onFocus() {
                this._setKeymasterScope();
            },
            onBlur: function onBlur() {
                this._resetKeymasterScope();
            },
            search: function search(term) {
                var _this7 = this;

                return new RSVP.Promise(function (resolve, reject) {
                    run.debounce(_this7, _this7._performSearch, term, resolve, reject, 200);
                });
            }
        }

    });
});