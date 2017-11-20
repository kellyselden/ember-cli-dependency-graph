define('ghost-admin/components/gh-timezone-select', ['exports', 'moment', 'ember-invoke-action'], function (exports, _moment, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var Component = Ember.Component;
    var computed = Ember.computed;
    var mapBy = Ember.computed.mapBy;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        classNames: ['form-group', 'for-select'],

        activeTimezone: null,
        availableTimezones: null,

        clock: service(),

        availableTimezoneNames: mapBy('availableTimezones', 'name'),

        hasTimezoneOverride: computed('activeTimezone', 'availableTimezoneNames', function () {
            var activeTimezone = this.get('activeTimezone');
            var availableTimezoneNames = this.get('availableTimezoneNames');

            return !availableTimezoneNames.includes(activeTimezone);
        }),

        selectedTimezone: computed('activeTimezone', 'availableTimezones', 'hasTimezoneOverride', function () {
            var hasTimezoneOverride = this.get('hasTimezoneOverride');
            var activeTimezone = this.get('activeTimezone');
            var availableTimezones = this.get('availableTimezones');

            if (hasTimezoneOverride) {
                return { name: '', label: '' };
            }

            return availableTimezones.filterBy('name', activeTimezone).get('firstObject');
        }),

        selectableTimezones: computed('availableTimezones', 'hasTimezoneOverride', function () {
            var hasTimezoneOverride = this.get('hasTimezoneOverride');
            var availableTimezones = this.get('availableTimezones');

            if (hasTimezoneOverride) {
                return [{ name: '', label: '' }].concat(_toConsumableArray(availableTimezones));
            }

            return availableTimezones;
        }),

        localTime: computed('hasTimezoneOverride', 'activeTimezone', 'selectedTimezone', 'clock.second', function () {
            var hasTimezoneOverride = this.get('hasTimezoneOverride');
            var timezone = hasTimezoneOverride ? this.get('activeTimezone') : this.get('selectedTimezone.name');

            this.get('clock.second');
            return timezone ? (0, _moment.default)().tz(timezone).format('HH:mm:ss') : (0, _moment.default)().utc().format('HH:mm:ss');
        }),

        actions: {
            setTimezone: function setTimezone(timezone) {
                (0, _emberInvokeAction.invokeAction)(this, 'update', timezone);
            }
        }
    });
});