define('ghost-admin/controllers/posts', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var computed = Ember.computed;
    var get = Ember.get;
    var service = Ember.inject.service;
    exports.default = Controller.extend({

        session: service(),
        store: service(),

        queryParams: ['type', 'author', 'tag', 'order'],
        type: null,
        author: null,
        tag: null,
        order: null,

        _hasLoadedTags: false,
        _hasLoadedAuthors: false,

        availableTypes: [{
            name: 'All posts',
            value: null
        }, {
            name: 'Draft posts',
            value: 'draft'
        }, {
            name: 'Published posts',
            value: 'published'
        }, {
            name: 'Scheduled posts',
            value: 'scheduled'
        }, {
            name: 'Featured posts',
            value: 'featured'
        }, {
            name: 'Pages',
            value: 'page'
        }],

        availableOrders: [{
            name: 'Newest',
            value: null
        }, {
            name: 'Oldest',
            value: 'published_at asc'
        }],

        showingAll: computed('type', 'author', 'tag', function () {
            var _getProperties = this.getProperties(['type', 'author', 'tag']),
                type = _getProperties.type,
                author = _getProperties.author,
                tag = _getProperties.tag;

            return !type && !author && !tag;
        }),

        selectedType: computed('type', function () {
            var types = this.get('availableTypes');
            return types.findBy('value', this.get('type'));
        }),

        selectedOrder: computed('order', function () {
            var orders = this.get('availableOrders');
            return orders.findBy('value', this.get('order'));
        }),

        _availableTags: computed(function () {
            return this.get('store').peekAll('tag');
        }),

        availableTags: computed('_availableTags.[]', function () {
            var tags = this.get('_availableTags').filter(function (tag) {
                return tag.get('id') !== null;
            });
            var options = tags.toArray();

            options.unshiftObject({ name: 'All tags', slug: null });

            return options;
        }),

        selectedTag: computed('tag', '_availableTags.[]', function () {
            var tag = this.get('tag');
            var tags = this.get('availableTags');

            return tags.findBy('slug', tag);
        }),

        _availableAuthors: computed(function () {
            return this.get('store').peekAll('user');
        }),

        availableAuthors: computed('_availableAuthors.[]', function () {
            var authors = this.get('_availableAuthors');
            var options = authors.toArray();

            options.unshiftObject({ name: 'All authors', slug: null });

            return options;
        }),

        selectedAuthor: computed('author', 'availableAuthors.[]', function () {
            var author = this.get('author');
            var authors = this.get('availableAuthors');

            return authors.findBy('slug', author);
        }),

        actions: {
            changeType: function changeType(type) {
                this.set('type', get(type, 'value'));
            },
            changeAuthor: function changeAuthor(author) {
                this.set('author', get(author, 'slug'));
            },
            changeTag: function changeTag(tag) {
                this.set('tag', get(tag, 'slug'));
            },
            changeOrder: function changeOrder(order) {
                this.set('order', get(order, 'value'));
            },
            openEditor: function openEditor(post) {
                this.transitionToRoute('editor.edit', post.get('id'));
            }
        }
    });
});