define('ghost-admin/components/gh-publishmenu-draft', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var isEmpty = Ember.isEmpty;
    exports.default = Component.extend({

        post: null,
        saveType: null,

        // used to set minDate in datepicker
        _minDate: null,
        _publishedAtBlogTZ: null,

        'data-test-publishmenu-draft': true,

        didInsertElement: function didInsertElement() {
            this.get('post').set('publishedAtBlogTZ', this.get('post.publishedAtUTC'));
            this.send('setSaveType', 'publish');
        },


        // API only accepts dates at least 2 mins in the future, default the
        // scheduled date 5 mins in the future to avoid immediate validation errors
        _getMinDate: function _getMinDate() {
            return _moment.default.utc().add(5, 'minutes');
        },


        actions: {
            setSaveType: function setSaveType(type) {
                if (this.get('saveType') !== type) {
                    var hasDateError = !isEmpty(this.get('post.errors').errorsFor('publishedAtBlogDate'));
                    var hasTimeError = !isEmpty(this.get('post.errors').errorsFor('publishedAtBlogTime'));
                    var minDate = this._getMinDate();

                    this.set('_minDate', minDate);
                    this.get('setSaveType')(type);

                    // when publish: switch to now to avoid validation errors
                    // when schedule: switch to last valid or new minimum scheduled date
                    if (type === 'publish') {
                        if (!hasDateError && !hasTimeError) {
                            this._publishedAtBlogTZ = this.get('post.publishedAtBlogTZ');
                        } else {
                            this._publishedAtBlogTZ = this.get('post.publishedAtUTC');
                        }

                        this.get('post').set('publishedAtBlogTZ', this.get('post.publishedAtUTC'));
                    } else {
                        if (!this._publishedAtBlogTZ || (0, _moment.default)(this._publishedAtBlogTZ).isBefore(minDate)) {
                            this.get('post').set('publishedAtBlogTZ', minDate);
                        } else {
                            this.get('post').set('publishedAtBlogTZ', this._publishedAtBlogTZ);
                        }
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

                post.set('publishedAtBlogTime', time);
                return post.validate();
            }
        }
    });
});