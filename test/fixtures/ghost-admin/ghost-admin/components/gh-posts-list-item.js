define('ghost-admin/components/gh-posts-list-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var equal = Ember.computed.equal;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var isBlank = Ember.isBlank;
    var service = Ember.inject.service;
    var Handlebars = Ember.Handlebars;
    exports.default = Component.extend({
        ghostPaths: service(),

        tagName: 'li',
        classNames: ['gh-posts-list-item'],
        classNameBindings: ['active'],

        post: null,
        active: false,

        isFeatured: alias('post.featured'),
        isPage: alias('post.page'),
        isDraft: equal('post.status', 'draft'),
        isPublished: equal('post.status', 'published'),
        isScheduled: equal('post.status', 'scheduled'),

        // closure actions
        onClick: function onClick() {},
        onDoubleClick: function onDoubleClick() {},


        authorName: computed('post.author.name', 'post.author.email', function () {
            return this.get('post.author.name') || this.get('post.author.email');
        }),

        authorAvatar: computed('post.author.profileImage', function () {
            return this.get('post.author.profileImage') || this.get('ghostPaths.assetRoot') + '/img/user-image.png';
        }),

        authorAvatarBackground: computed('authorAvatar', function () {
            var authorAvatar = this.get('authorAvatar');
            var safeUrl = Handlebars.Utils.escapeExpression(authorAvatar);
            return htmlSafe('background-image: url(' + safeUrl + ')');
        }),

        // HACK: this is intentionally awful due to time constraints
        // TODO: find a better way to get an excerpt! :)
        subText: computed('post.{plaintext,metaDescription}', function () {
            var text = this.get('post.plaintext');
            var metaDescription = this.get('post.metaDescription');

            if (!isBlank(metaDescription)) {
                text = metaDescription;
            }
            return text.slice(0, 80) + '...';
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            if (this.get('active')) {
                this.scrollIntoView();
            }
        },
        click: function click() {
            this.onClick(this.get('post'));
        },
        doubleClick: function doubleClick() {
            this.onDoubleClick(this.get('post'));
        },
        scrollIntoView: function scrollIntoView() {
            var element = this.$();
            var offset = element.offset().top;
            var elementHeight = element.height();
            var container = $('.content-list');
            var containerHeight = container.height();
            var currentScroll = container.scrollTop();
            var isBelowTop = void 0,
                isAboveBottom = void 0,
                isOnScreen = void 0;

            isAboveBottom = offset < containerHeight;
            isBelowTop = offset > elementHeight;

            isOnScreen = isBelowTop && isAboveBottom;

            if (!isOnScreen) {
                // Scroll so that element is centered in container
                // 40 is the amount of padding on the container
                container.clearQueue().animate({
                    scrollTop: currentScroll + offset - 40 - containerHeight / 2
                });
            }
        }
    });
});