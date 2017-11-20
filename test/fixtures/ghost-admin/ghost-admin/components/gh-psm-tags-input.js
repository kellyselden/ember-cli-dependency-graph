define('ghost-admin/components/gh-psm-tags-input', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({

        store: service(),

        // public attrs
        post: null,
        tagName: '',

        // live-query of all tags for tag input autocomplete
        availableTags: computed(function () {
            return this.get('store').filter('tag', { limit: 'all' }, function () {
                return true;
            });
        }),

        availableTagNames: computed('availableTags.@each.name', function () {
            return this.get('availableTags').map(function (tag) {
                return tag.get('name').toLowerCase();
            });
        }),

        actions: {
            matchTags: function matchTags(tagName, term) {
                return tagName.toLowerCase() === term.trim().toLowerCase();
            },
            hideCreateOptionOnMatchingTag: function hideCreateOptionOnMatchingTag(term) {
                return !this.get('availableTagNames').includes(term.toLowerCase());
            },
            updateTags: function updateTags(newTags) {
                var currentTags = this.get('post.tags');

                // destroy new+unsaved tags that are no longer selected
                currentTags.forEach(function (tag) {
                    if (!newTags.includes(tag) && tag.get('isNew')) {
                        tag.destroyRecord();
                    }
                });

                // update tags
                return this.set('post.tags', newTags);
            },
            createTag: function createTag(tagName) {
                var _this = this;

                var currentTags = this.get('post.tags');
                var currentTagNames = currentTags.map(function (tag) {
                    return tag.get('name').toLowerCase();
                });
                var tagToAdd = void 0;

                tagName = tagName.trim();

                // abort if tag is already selected
                if (currentTagNames.includes(tagName.toLowerCase())) {
                    return;
                }

                // add existing tag or create new one
                return this._findTagByName(tagName).then(function (matchedTag) {
                    tagToAdd = matchedTag;

                    // create new tag if no match
                    if (!tagToAdd) {
                        tagToAdd = _this.get('store').createRecord('tag', {
                            name: tagName
                        });
                    }

                    // push tag onto post relationship
                    return currentTags.pushObject(tagToAdd);
                });
            }
        },

        // methods

        _findTagByName: function _findTagByName(name) {
            return this.get('availableTags').then(function (availableTags) {
                return availableTags.find(function (tag) {
                    return tag.get('name').toLowerCase() === name.toLowerCase();
                });
            });
        }
    });
});