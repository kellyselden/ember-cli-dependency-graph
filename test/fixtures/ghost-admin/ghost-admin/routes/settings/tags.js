define('ghost-admin/routes/settings/tags', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/current-user-settings', 'ghost-admin/mixins/shortcuts-route'], function (exports, _authenticated, _currentUserSettings, _shortcutsRoute) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    exports.default = _authenticated.default.extend(_currentUserSettings.default, _shortcutsRoute.default, {
        titleToken: 'Settings - Tags',

        shortcuts: {
            'up, k': 'moveUp',
            'down, j': 'moveDown',
            left: 'focusList',
            right: 'focusContent',
            c: 'newTag'
        },

        // authors aren't allowed to manage tags
        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);

            return this.get('session.user').then(this.transitionAuthor());
        },


        // set model to a live array so all tags are shown and created/deleted tags
        // are automatically added/removed. Also load all tags in the background,
        // pausing to show the loading spinner if no tags have been loaded yet
        model: function model() {
            var promise = this.store.query('tag', { limit: 'all', include: 'count.posts' });
            var filter = this.store.filter('tag', function (tag) {
                return !tag.get('isNew');
            });

            if (this.store.peekAll('tag').get('length') === 0) {
                return promise.then(function () {
                    return filter;
                });
            } else {
                return filter;
            }
        },
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.send('resetShortcutsScope');
        },
        stepThroughTags: function stepThroughTags(step) {
            var currentTag = this.modelFor('settings.tags.tag');
            var tags = this.get('controller.sortedTags');
            var length = tags.get('length');

            if (currentTag && length) {
                var newPosition = tags.indexOf(currentTag) + step;

                if (newPosition >= length) {
                    return;
                } else if (newPosition < 0) {
                    return;
                }

                this.transitionTo('settings.tags.tag', tags.objectAt(newPosition));
            }
        },
        scrollContent: function scrollContent(amount) {
            var content = $('.tag-settings-pane');
            var scrolled = content.scrollTop();

            content.scrollTop(scrolled + 50 * amount);
        },


        actions: {
            moveUp: function moveUp() {
                if (this.controller.get('tagContentFocused')) {
                    this.scrollContent(-1);
                } else {
                    this.stepThroughTags(-1);
                }
            },
            moveDown: function moveDown() {
                if (this.controller.get('tagContentFocused')) {
                    this.scrollContent(1);
                } else {
                    this.stepThroughTags(1);
                }
            },
            focusList: function focusList() {
                this.set('controller.keyboardFocus', 'tagList');
            },
            focusContent: function focusContent() {
                this.set('controller.keyboardFocus', 'tagContent');
            },
            newTag: function newTag() {
                this.transitionTo('settings.tags.new');
            },
            resetShortcutsScope: function resetShortcutsScope() {
                key.setScope('default');
            }
        }
    });
});