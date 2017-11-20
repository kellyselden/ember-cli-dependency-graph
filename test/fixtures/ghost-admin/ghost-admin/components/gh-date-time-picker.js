define('ghost-admin/components/gh-date-time-picker', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    var isEmpty = Ember.isEmpty;
    var or = Ember.computed.or;
    var reads = Ember.computed.reads;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        settings: service(),

        tagName: '',

        date: '',
        time: '',
        errors: null,
        dateErrorProperty: null,
        timeErrorProperty: null,

        _time: '',
        _previousTime: '',
        _minDate: null,
        _maxDate: null,

        blogTimezone: reads('settings.activeTimezone'),
        hasError: or('dateError', 'timeError'),

        timezone: computed('blogTimezone', function () {
            var blogTimezone = this.get('blogTimezone');
            return _moment.default.utc().tz(blogTimezone).format('z');
        }),

        dateError: computed('errors.[]', 'dateErrorProperty', function () {
            var errors = this.get('errors');
            var property = this.get('dateErrorProperty');

            if (!isEmpty(errors.errorsFor(property))) {
                return errors.errorsFor(property).get('firstObject').message;
            }
        }),

        timeError: computed('errors.[]', 'timeErrorProperty', function () {
            var errors = this.get('errors');
            var property = this.get('timeErrorProperty');

            if (!isEmpty(errors.errorsFor(property))) {
                return errors.errorsFor(property).get('firstObject').message;
            }
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            var date = this.get('date');
            var time = this.get('time');
            var minDate = this.get('minDate');
            var maxDate = this.get('maxDate');
            var blogTimezone = this.get('blogTimezone');

            if (!isBlank(date)) {
                this.set('_date', (0, _moment.default)(date));
            } else {
                this.set('_date', (0, _moment.default)().tz(blogTimezone));
            }

            if (isBlank(time)) {
                this.set('_time', this.get('_date').format('HH:mm'));
            } else {
                this.set('_time', this.get('time'));
            }
            this.set('_previousTime', this.get('_time'));

            // unless min/max date is at midnight moment will diable that day
            if (minDate === 'now') {
                this.set('_minDate', (0, _moment.default)((0, _moment.default)().format('YYYY-MM-DD')));
            } else if (!isBlank(minDate)) {
                this.set('_minDate', (0, _moment.default)((0, _moment.default)(minDate).format('YYYY-MM-DD')));
            } else {
                this.set('_minDate', null);
            }

            if (maxDate === 'now') {
                this.set('_maxDate', (0, _moment.default)((0, _moment.default)().format('YYYY-MM-DD')));
            } else if (!isBlank(maxDate)) {
                this.set('_maxDate', (0, _moment.default)((0, _moment.default)(maxDate).format('YYYY-MM-DD')));
            } else {
                this.set('_maxDate', null);
            }
        },


        actions: {
            // if date or time is set and the other property is blank set that too
            // so that we don't get "can't be blank" errors
            setDate: function setDate(date) {
                if (date !== this.get('_date')) {
                    this.get('setDate')(date);

                    if (isBlank(this.get('time'))) {
                        this.get('setTime')(this.get('_time'));
                    }
                }
            },
            setTime: function setTime(time) {
                if (time !== this.get('_previousTime')) {
                    this.get('setTime')(time);
                    this.set('_previousTime', time);

                    if (isBlank(this.get('date'))) {
                        this.get('setDate')(this.get('_date'));
                    }
                }
            }
        }
    });
});