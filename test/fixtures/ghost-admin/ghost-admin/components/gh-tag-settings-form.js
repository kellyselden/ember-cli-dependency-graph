define('ghost-admin/components/gh-tag-settings-form', ['exports', 'ghost-admin/utils/bound-one-way', 'ember-invoke-action'], function (exports, _boundOneWay, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var reads = Ember.computed.reads;
    var service = Ember.inject.service;
    var Handlebars = Ember.Handlebars;
    exports.default = Component.extend({

        tag: null,

        scratchName: (0, _boundOneWay.default)('tag.name'),
        scratchSlug: (0, _boundOneWay.default)('tag.slug'),
        scratchDescription: (0, _boundOneWay.default)('tag.description'),
        scratchMetaTitle: (0, _boundOneWay.default)('tag.metaTitle'),
        scratchMetaDescription: (0, _boundOneWay.default)('tag.metaDescription'),

        isViewingSubview: false,

        feature: service(),
        config: service(),
        mediaQueries: service(),

        isMobile: reads('mediaQueries.maxWidth600'),

        title: computed('tag.isNew', function () {
            if (this.get('tag.isNew')) {
                return 'New Tag';
            } else {
                return 'Tag Settings';
            }
        }),

        seoTitle: computed('scratchName', 'scratchMetaTitle', function () {
            var metaTitle = this.get('scratchMetaTitle') || '';

            metaTitle = metaTitle.length > 0 ? metaTitle : this.get('scratchName');

            if (metaTitle && metaTitle.length > 70) {
                metaTitle = metaTitle.substring(0, 70).trim();
                metaTitle = Handlebars.Utils.escapeExpression(metaTitle);
                metaTitle = htmlSafe(metaTitle + '&hellip;');
            }

            return metaTitle;
        }),

        seoURL: computed('scratchSlug', function () {
            var blogUrl = this.get('config.blogUrl');
            var seoSlug = this.get('scratchSlug') || '';

            var seoURL = blogUrl + '/tag/' + seoSlug;

            // only append a slash to the URL if the slug exists
            if (seoSlug) {
                seoURL += '/';
            }

            if (seoURL.length > 70) {
                seoURL = seoURL.substring(0, 70).trim();
                seoURL = Handlebars.Utils.escapeExpression(seoURL);
                seoURL = htmlSafe(seoURL + '&hellip;');
            }

            return seoURL;
        }),

        seoDescription: computed('scratchDescription', 'scratchMetaDescription', function () {
            var metaDescription = this.get('scratchMetaDescription') || '';

            metaDescription = metaDescription.length > 0 ? metaDescription : this.get('scratchDescription');

            if (metaDescription && metaDescription.length > 156) {
                metaDescription = metaDescription.substring(0, 156).trim();
                metaDescription = Handlebars.Utils.escapeExpression(metaDescription);
                metaDescription = htmlSafe(metaDescription + '&hellip;');
            }

            return metaDescription;
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            var oldTagId = this._oldTagId;
            var newTagId = this.get('tag.id');

            if (newTagId !== oldTagId) {
                this.reset();
            }

            this._oldTagId = newTagId;
        },
        reset: function reset() {
            this.set('isViewingSubview', false);
            if (this.$()) {
                this.$('.settings-menu-pane').scrollTop(0);
            }
        },
        focusIn: function focusIn() {
            key.setScope('tag-settings-form');
        },
        focusOut: function focusOut() {
            key.setScope('default');
        },


        actions: {
            setProperty: function setProperty(property, value) {
                (0, _emberInvokeAction.invokeAction)(this, 'setProperty', property, value);
            },
            setCoverImage: function setCoverImage(image) {
                this.send('setProperty', 'featureImage', image);
            },
            clearCoverImage: function clearCoverImage() {
                this.send('setProperty', 'featureImage', '');
            },
            openMeta: function openMeta() {
                this.set('isViewingSubview', true);
            },
            closeMeta: function closeMeta() {
                this.set('isViewingSubview', false);
            },
            deleteTag: function deleteTag() {
                (0, _emberInvokeAction.invokeAction)(this, 'showDeleteTagModal');
            }
        }

    });
});