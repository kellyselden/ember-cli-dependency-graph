define('ghost-admin/components/gh-publishmenu-scheduled', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        clock: service(),

        post: null,
        saveType: null,
        isClosing: null,

        // used to set minDate in datepicker
        _minDate: null,

        'data-test-publishmenu-scheduled': true,

        timeToPublished: computed('post.publishedAtUTC', 'clock.second', function () {
            var publishedAtUTC = this.get('post.publishedAtUTC');

            if (!publishedAtUTC) {
                return null;
            }

            this.get('clock.second');

            return publishedAtUTC.toNow(true);
        }),

        didInsertElement: function didInsertElement() {
            this.set('_minDate', new Date());
            this.get('setSaveType')('schedule');
        },


        actions: {
            setSaveType: function setSaveType(type) {
                if (this.get('saveType') !== type) {
                    this.set('_minDate', new Date());
                    this.get('setSaveType')(type);

                    // when draft switch to now to avoid validation errors
                    // when schedule switch back to saved date to avoid unnecessary re-scheduling
                    if (type === 'draft') {
                        this.get('post').set('publishedAtBlogTZ', new Date());
                    } else {
                        this.get('post').set('publishedAtBlogTZ', this.get('post.publishedAtUTC'));
                    }

                    this.get('post').validate();
                }
            },
            setDate: function setDate(date) {
                var post = this.get('post');
                var dateString = (0, _moment.default)(date).format('YYYY-MM-DD');

                post.set('publishedAtBlogDate', dateString);
                return post.validate();
            },
            setTime: function setTime(time) {
                var post = this.get('post');

                if (!this.get('isClosing')) {
                    post.set('publishedAtBlogTime', time);
                    return post.validate();
                }
            }
        }
    });
});