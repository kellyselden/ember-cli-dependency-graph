define('ghost-admin/helpers/gh-format-post-time', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var Helper = Ember.Helper;
    var service = Ember.inject.service;
    exports.default = Helper.extend({
        settings: service(),

        compute: function compute(_ref, _ref2) {
            var _ref3 = _slicedToArray(_ref, 1),
                timeago = _ref3[0];

            var draft = _ref2.draft,
                scheduled = _ref2.scheduled,
                published = _ref2.published;
            (true && !('You must pass a time to the gh-format-post-time helper') && Ember.assert(timeago, 'You must pass a time to the gh-format-post-time helper'));


            if (draft) {
                // No special handling for drafts, just use moment.from
                return (0, _moment.default)(timeago).from(_moment.default.utc());
            }

            var timezone = this.get('settings.activeTimezone');
            var time = _moment.default.tz(timeago, timezone);
            var now = _moment.default.tz(_moment.default.utc(), timezone);

            // If not a draft and post was published <= 15 minutes ago
            // or scheduled to be published <= 15 minutes from now, use moment.from
            if (Math.abs(now.diff(time, 'minutes')) <= 15) {
                return time.from(now);
            }

            // If scheduled for or published on the same day, render the time + Today
            if (time.isSame(now, 'day')) {
                var formatted = time.format('HH:mm [Today]');
                return scheduled ? 'at ' + formatted : formatted;
            }

            // if published yesterday, render time + yesterday
            // This check comes before scheduled, because there are likely to be more published
            // posts than scheduled posts.
            if (published && time.isSame(now.clone().subtract(1, 'days').startOf('day'), 'day')) {
                return time.format('HH:mm [Yesterday]');
            }

            // if scheduled for tomorrow, render the time + Tomorrow
            if (scheduled && time.isSame(now.clone().add(1, 'days').startOf('day'), 'day')) {
                return time.format('[at] HH:mm [Tomorrow]');
            }

            // Else, render just the date if published, or the time & date if scheduled
            var format = scheduled ? '[at] HH:mm [on] DD MMM YYYY' : 'DD MMM YYYY';
            return time.format(format);
        }
    });
});