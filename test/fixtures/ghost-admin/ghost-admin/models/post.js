define('ghost-admin/models/post', ['exports', 'ember-data/model', 'ghost-admin/mixins/validation-engine', 'ember-data/attr', 'ghost-admin/utils/bound-one-way', 'moment', 'ghost-admin/components/gh-markdown-editor', 'ember-data/relationships'], function (exports, _model, _validationEngine, _attr, _boundOneWay, _moment, _ghMarkdownEditor, _relationships) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var _compare = Ember.compare;
    var computed = Ember.computed;
    var equal = Ember.computed.equal;
    var filterBy = Ember.computed.filterBy;
    var isBlank = Ember.isBlank;
    var observer = Ember.observer;
    var service = Ember.inject.service;
    var Comparable = Ember.Comparable;


    function statusCompare(postA, postB) {
        var status1 = postA.get('status');
        var status2 = postB.get('status');

        // if any of those is empty
        if (!status1 && !status2) {
            return 0;
        }

        if (!status1 && status2) {
            return -1;
        }

        if (!status2 && status1) {
            return 1;
        }

        // We have to make sure, that scheduled posts will be listed first
        // after that, draft and published will be sorted alphabetically and don't need
        // any manual comparison.

        if (status1 === 'scheduled' && (status2 === 'draft' || status2 === 'published')) {
            return -1;
        }

        if (status2 === 'scheduled' && (status1 === 'draft' || status1 === 'published')) {
            return 1;
        }

        return _compare(status1.valueOf(), status2.valueOf());
    }

    function publishedAtCompare(postA, postB) {
        var published1 = postA.get('publishedAtUTC');
        var published2 = postB.get('publishedAtUTC');

        if (!published1 && !published2) {
            return 0;
        }

        if (!published1 && published2) {
            return -1;
        }

        if (!published2 && published1) {
            return 1;
        }

        return _compare(published1.valueOf(), published2.valueOf());
    }

    exports.default = _model.default.extend(Comparable, _validationEngine.default, {
        config: service(),
        ghostPaths: service(),
        clock: service(),
        settings: service(),

        validationType: 'post',

        authorId: (0, _attr.default)('string'),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        customExcerpt: (0, _attr.default)('string'),
        featured: (0, _attr.default)('boolean', { defaultValue: false }),
        featureImage: (0, _attr.default)('string'),
        codeinjectionFoot: (0, _attr.default)('string', { defaultValue: '' }),
        codeinjectionHead: (0, _attr.default)('string', { defaultValue: '' }),
        customTemplate: (0, _attr.default)('string'),
        ogImage: (0, _attr.default)('string'),
        ogTitle: (0, _attr.default)('string'),
        ogDescription: (0, _attr.default)('string'),
        twitterImage: (0, _attr.default)('string'),
        twitterTitle: (0, _attr.default)('string'),
        twitterDescription: (0, _attr.default)('string'),
        html: (0, _attr.default)('string'),
        locale: (0, _attr.default)('string'),
        metaDescription: (0, _attr.default)('string'),
        metaTitle: (0, _attr.default)('string'),
        mobiledoc: (0, _attr.default)('json-string', { defaultValue: function defaultValue() {
                return _ghMarkdownEditor.BLANK_DOC;
            } }),
        page: (0, _attr.default)('boolean', { defaultValue: false }),
        plaintext: (0, _attr.default)('string'),
        publishedAtUTC: (0, _attr.default)('moment-utc'),
        slug: (0, _attr.default)('string'),
        status: (0, _attr.default)('string', { defaultValue: 'draft' }),
        title: (0, _attr.default)('string', { defaultValue: '' }),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        updatedBy: (0, _attr.default)(),
        url: (0, _attr.default)('string'),
        uuid: (0, _attr.default)('string'),

        author: (0, _relationships.belongsTo)('user', { async: true }),
        createdBy: (0, _relationships.belongsTo)('user', { async: true }),
        publishedBy: (0, _relationships.belongsTo)('user', { async: true }),
        tags: (0, _relationships.hasMany)('tag', {
            embedded: 'always',
            async: false
        }),

        scratch: null,
        titleScratch: null,

        // HACK: used for validation so that date/time can be validated based on
        // eventual status rather than current status
        statusScratch: null,

        // For use by date/time pickers - will be validated then converted to UTC
        // on save. Updated by an observer whenever publishedAtUTC changes.
        // Everything that revolves around publishedAtUTC only cares about the saved
        // value so this should be almost entirely internal
        publishedAtBlogDate: '',
        publishedAtBlogTime: '',

        customExcerptScratch: (0, _boundOneWay.default)('customExcerpt'),
        codeinjectionFootScratch: (0, _boundOneWay.default)('codeinjectionFoot'),
        codeinjectionHeadScratch: (0, _boundOneWay.default)('codeinjectionHead'),
        metaDescriptionScratch: (0, _boundOneWay.default)('metaDescription'),
        metaTitleScratch: (0, _boundOneWay.default)('metaTitle'),
        ogDescriptionScratch: (0, _boundOneWay.default)('ogDescription'),
        ogTitleScratch: (0, _boundOneWay.default)('ogTitle'),
        twitterDescriptionScratch: (0, _boundOneWay.default)('twitterDescription'),
        twitterTitleScratch: (0, _boundOneWay.default)('twitterTitle'),

        isPublished: equal('status', 'published'),
        isDraft: equal('status', 'draft'),
        internalTags: filterBy('tags', 'isInternal', true),
        isScheduled: equal('status', 'scheduled'),

        absoluteUrl: computed('url', 'ghostPaths.url', 'config.blogUrl', function () {
            var blogUrl = this.get('config.blogUrl');
            var postUrl = this.get('url');
            return this.get('ghostPaths.url').join(blogUrl, postUrl);
        }),

        previewUrl: computed('uuid', 'ghostPaths.url', 'config.blogUrl', 'config.routeKeywords.preview', function () {
            var blogUrl = this.get('config.blogUrl');
            var uuid = this.get('uuid');
            var previewKeyword = this.get('config.routeKeywords.preview');
            // New posts don't have a preview
            if (!uuid) {
                return '';
            }
            return this.get('ghostPaths.url').join(blogUrl, previewKeyword, uuid);
        }),

        // check every second to see if we're past the scheduled time
        // will only re-compute if this property is being observed elsewhere
        pastScheduledTime: computed('isScheduled', 'publishedAtUTC', 'clock.second', function () {
            if (this.get('isScheduled')) {
                var now = _moment.default.utc();
                var publishedAtUTC = this.get('publishedAtUTC') || now;
                var pastScheduledTime = publishedAtUTC.diff(now, 'hours', true) < 0;

                // force a recompute
                this.get('clock.second');

                return pastScheduledTime;
            } else {
                return false;
            }
        }),

        publishedAtBlogTZ: computed('publishedAtBlogDate', 'publishedAtBlogTime', 'settings.activeTimezone', {
            get: function get() {
                return this._getPublishedAtBlogTZ();
            },
            set: function set(key, value) {
                var momentValue = value ? (0, _moment.default)(value) : null;
                this._setPublishedAtBlogStrings(momentValue);
                return this._getPublishedAtBlogTZ();
            }
        }),

        _getPublishedAtBlogTZ: function _getPublishedAtBlogTZ() {
            var publishedAtUTC = this.get('publishedAtUTC');
            var publishedAtBlogDate = this.get('publishedAtBlogDate');
            var publishedAtBlogTime = this.get('publishedAtBlogTime');
            var blogTimezone = this.get('settings.activeTimezone');

            if (!publishedAtUTC && isBlank(publishedAtBlogDate) && isBlank(publishedAtBlogTime)) {
                return null;
            }

            if (publishedAtBlogDate && publishedAtBlogTime) {
                var publishedAtBlog = _moment.default.tz(publishedAtBlogDate + ' ' + publishedAtBlogTime, blogTimezone);

                /**
                 * Note:
                 * If you create a post and publish it, we send seconds to the database.
                 * If you edit the post afterwards, ember would send the date without seconds, because
                 * the `publishedAtUTC` is based on `publishedAtBlogTime`, which is only in seconds.
                 * The date time picker doesn't use seconds.
                 *
                 * This condition prevents the case:
                 *   - you edit a post, but you don't change the published_at time
                 *   - we keep the original date with seconds
                 *
                 * See https://github.com/TryGhost/Ghost/issues/8603#issuecomment-309538395.
                 */
                if (publishedAtUTC && publishedAtBlog.diff(publishedAtUTC.clone().startOf('minutes')) === 0) {
                    return publishedAtUTC;
                }

                return publishedAtBlog;
            } else {
                return _moment.default.tz(this.get('publishedAtUTC'), blogTimezone);
            }
        },


        _setPublishedAtBlogTZ: observer('publishedAtUTC', 'settings.activeTimezone', function () {
            var publishedAtUTC = this.get('publishedAtUTC');
            this._setPublishedAtBlogStrings(publishedAtUTC);
        }).on('init'),

        _setPublishedAtBlogStrings: function _setPublishedAtBlogStrings(momentDate) {
            if (momentDate) {
                var blogTimezone = this.get('settings.activeTimezone');
                var publishedAtBlog = _moment.default.tz(momentDate, blogTimezone);

                this.set('publishedAtBlogDate', publishedAtBlog.format('YYYY-MM-DD'));
                this.set('publishedAtBlogTime', publishedAtBlog.format('HH:mm'));
            } else {
                this.set('publishedAtBlogDate', '');
                this.set('publishedAtBlogTime', '');
            }
        },


        // remove client-generated tags, which have `id: null`.
        // Ember Data won't recognize/update them automatically
        // when returned from the server with ids.
        // https://github.com/emberjs/data/issues/1829
        updateTags: function updateTags() {
            var tags = this.get('tags');
            var oldTags = tags.filterBy('id', null);

            tags.removeObjects(oldTags);
            oldTags.invoke('deleteRecord');
        },
        isAuthoredByUser: function isAuthoredByUser(user) {
            return user.get('id') === this.get('authorId');
        },


        // a custom sort function is needed in order to sort the posts list the same way the server would:
        //     status: scheduled, draft, published
        //     publishedAt: DESC
        //     updatedAt: DESC
        //     id: DESC
        compare: function compare(postA, postB) {
            var updated1 = postA.get('updatedAtUTC');
            var updated2 = postB.get('updatedAtUTC');
            var idResult = void 0,
                publishedAtResult = void 0,
                statusResult = void 0,
                updatedAtResult = void 0;

            // when `updatedAt` is undefined, the model is still
            // being written to with the results from the server
            if (postA.get('isNew') || !updated1) {
                return -1;
            }

            if (postB.get('isNew') || !updated2) {
                return 1;
            }

            // TODO: revisit the ID sorting because we no longer have auto-incrementing IDs
            idResult = _compare(postA.get('id'), postB.get('id'));
            statusResult = statusCompare(postA, postB);
            updatedAtResult = _compare(updated1.valueOf(), updated2.valueOf());
            publishedAtResult = publishedAtCompare(postA, postB);

            if (statusResult === 0) {
                if (publishedAtResult === 0) {
                    if (updatedAtResult === 0) {
                        // This should be DESC
                        return idResult * -1;
                    }
                    // This should be DESC
                    return updatedAtResult * -1;
                }
                // This should be DESC
                return publishedAtResult * -1;
            }

            return statusResult;
        },


        // this is a hook added by the ValidationEngine mixin and is called after
        // successful validation and before this.save()
        //
        // the publishedAtBlog{Date/Time} strings are set separately so they can be
        // validated, grab that time if it exists and set the publishedAtUTC
        beforeSave: function beforeSave() {
            var publishedAtBlogTZ = this.get('publishedAtBlogTZ');
            var publishedAtUTC = publishedAtBlogTZ ? publishedAtBlogTZ.utc() : null;
            this.set('publishedAtUTC', publishedAtUTC);
        }
    });
});