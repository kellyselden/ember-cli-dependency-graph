define('ghost-admin/validators/post', ['exports', 'ghost-admin/validators/base', 'moment'], function (exports, _base, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var isEmpty = Ember.isEmpty;
    var isPresent = Ember.isPresent;
    exports.default = _base.default.create({
        properties: ['title', 'customExcerpt', 'codeinjectionHead', 'codeinjectionFoot', 'metaTitle', 'metaDescription', 'ogtitle', 'ogDescription', 'twitterTitle', 'twitterDescription', 'publishedAtBlogTime', 'publishedAtBlogDate'],

        title: function title(model) {
            var title = model.get('title');

            if (validator.empty(title)) {
                model.get('errors').add('title', 'You must specify a title for the post.');
                this.invalidate();
            }

            if (!validator.isLength(title, 0, 255)) {
                model.get('errors').add('title', 'Title cannot be longer than 255 characters.');
                this.invalidate();
            }
        },
        customExcerpt: function customExcerpt(model) {
            var customExcerpt = model.get('customExcerpt');

            if (!validator.isLength(customExcerpt, 0, 300)) {
                model.get('errors').add('customExcerpt', 'Excerpt cannot be longer than 300 characters.');
                this.invalidate();
            }
        },
        codeinjectionFoot: function codeinjectionFoot(model) {
            var codeinjectionFoot = model.get('codeinjectionFoot');

            if (!validator.isLength(codeinjectionFoot, 0, 65535)) {
                model.get('errors').add('codeinjectionFoot', 'Footer code cannot be longer than 65535 characters.');
                this.invalidate();
            }
        },
        codeinjectionHead: function codeinjectionHead(model) {
            var codeinjectionHead = model.get('codeinjectionHead');

            if (!validator.isLength(codeinjectionHead, 0, 65535)) {
                model.get('errors').add('codeinjectionHead', 'Header code cannot be longer than 65535 characters.');
                this.invalidate();
            }
        },
        metaTitle: function metaTitle(model) {
            var metaTitle = model.get('metaTitle');

            if (!validator.isLength(metaTitle, 0, 300)) {
                model.get('errors').add('metaTitle', 'Meta Title cannot be longer than 300 characters.');
                this.invalidate();
            }
        },
        metaDescription: function metaDescription(model) {
            var metaDescription = model.get('metaDescription');

            if (!validator.isLength(metaDescription, 0, 500)) {
                model.get('errors').add('metaDescription', 'Meta Description cannot be longer than 500 characters.');
                this.invalidate();
            }
        },
        ogTitle: function ogTitle(model) {
            var ogTitle = model.get('ogTitle');

            if (!validator.isLength(ogTitle, 0, 300)) {
                model.get('errors').add('ogTitle', 'Facebook Title cannot be longer than 300 characters.');
                this.invalidate();
            }
        },
        ogDescription: function ogDescription(model) {
            var ogDescription = model.get('ogDescription');

            if (!validator.isLength(ogDescription, 0, 500)) {
                model.get('errors').add('ogDescription', 'Facebook Description cannot be longer than 500 characters.');
                this.invalidate();
            }
        },
        twitterTitle: function twitterTitle(model) {
            var twitterTitle = model.get('twitterTitle');

            if (!validator.isLength(twitterTitle, 0, 300)) {
                model.get('errors').add('twitterTitle', 'Twitter Title cannot be longer than 300 characters.');
                this.invalidate();
            }
        },
        twitterDescription: function twitterDescription(model) {
            var twitterDescription = model.get('twitterDescription');

            if (!validator.isLength(twitterDescription, 0, 500)) {
                model.get('errors').add('twitterDescription', 'Twitter Description cannot be longer than 500 characters.');
                this.invalidate();
            }
        },

        // for posts which haven't been published before and where the blog date/time
        // is blank we should ignore the validation
        _shouldValidatePublishedAtBlog: function _shouldValidatePublishedAtBlog(model) {
            var publishedAtUTC = model.get('publishedAtUTC');
            var publishedAtBlogDate = model.get('publishedAtBlogDate');
            var publishedAtBlogTime = model.get('publishedAtBlogTime');

            return isPresent(publishedAtUTC) || isPresent(publishedAtBlogDate) || isPresent(publishedAtBlogTime);
        },


        // convenience method as .validate({property: 'x'}) doesn't accept multiple properties
        publishedAtBlog: function publishedAtBlog(model) {
            this.publishedAtBlogTime(model);
            this.publishedAtBlogDate(model);
        },
        publishedAtBlogTime: function publishedAtBlogTime(model) {
            var publishedAtBlogTime = model.get('publishedAtBlogTime');
            var timeRegex = /^(([0-1]?[0-9])|([2][0-3])):([0-5][0-9])$/;

            if (!timeRegex.test(publishedAtBlogTime) && this._shouldValidatePublishedAtBlog(model)) {
                model.get('errors').add('publishedAtBlogTime', 'Must be in format: "15:00"');
                this.invalidate();
            }
        },
        publishedAtBlogDate: function publishedAtBlogDate(model) {
            var publishedAtBlogDate = model.get('publishedAtBlogDate');
            var publishedAtBlogTime = model.get('publishedAtBlogTime');

            if (!this._shouldValidatePublishedAtBlog(model)) {
                return;
            }

            // we have a time string but no date string
            if (validator.empty(publishedAtBlogDate) && !validator.empty(publishedAtBlogTime)) {
                model.get('errors').add('publishedAtBlogDate', 'Can\'t be blank');
                return this.invalidate();
            }

            // don't validate the date if the time format is incorrect
            if (isEmpty(model.get('errors').errorsFor('publishedAtBlogTime'))) {
                var status = model.get('statusScratch') || model.get('status');
                var now = (0, _moment.default)();
                var publishedAtUTC = model.get('publishedAtUTC');
                var publishedAtBlogTZ = model.get('publishedAtBlogTZ');
                var matchesExisting = publishedAtUTC && publishedAtBlogTZ.isSame(publishedAtUTC);
                var isInFuture = publishedAtBlogTZ.isSameOrAfter(now.add(2, 'minutes'));

                // draft/published must be in past
                if ((status === 'draft' || status === 'published') && publishedAtBlogTZ.isSameOrAfter(now)) {
                    model.get('errors').add('publishedAtBlogDate', 'Must be in the past');
                    this.invalidate();

                    // scheduled must be at least 2 mins in the future
                    // ignore if it matches publishedAtUTC as that is likely an update of a scheduled post
                } else if (status === 'scheduled' && !matchesExisting && !isInFuture) {
                    model.get('errors').add('publishedAtBlogDate', 'Must be at least 2 mins in the future');
                    this.invalidate();
                }
            }
        }
    });
});