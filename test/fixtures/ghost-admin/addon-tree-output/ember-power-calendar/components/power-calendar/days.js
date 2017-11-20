define('ember-power-calendar/components/power-calendar/days', ['exports', 'ember-power-calendar/templates/components/power-calendar/days', 'moment'], function (exports, _days, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  var scheduleOnce = Ember.run.scheduleOnce;


  function withLocale(locale, fn) {
    var returnValue = void 0;
    if (locale) {
      var previousLocale = _moment.default.locale();
      _moment.default.locale(locale);
      returnValue = fn();
      _moment.default.locale(previousLocale);
    } else {
      returnValue = fn();
    }
    return returnValue;
  }

  exports.default = Component.extend({
    layout: _days.default,
    focusedId: null,
    showDaysAround: true,
    classNames: ['ember-power-calendar-days'],
    weekdayFormat: 'short', // "min" | "short" | "long"
    powerCalendarService: service('power-calendar'),
    attributeBindings: ['data-power-calendar-id'],

    // CPs
    'data-power-calendar-id': computed.oneWay('calendar.uniqueId'),
    weekdaysMin: computed('calendar.locale', function () {
      return withLocale(this.get('calendar.locale'), function () {
        return _moment.default.weekdaysMin();
      });
    }),

    weekdaysShort: computed('calendar.locale', function () {
      return withLocale(this.get('calendar.locale'), function () {
        return _moment.default.weekdaysShort();
      });
    }),

    weekdays: computed('calendar.locale', function () {
      return withLocale(this.get('calendar.locale'), function () {
        return _moment.default.weekdays();
      });
    }),

    localeStartOfWeek: computed('weekdaysShort', 'startOfWeek', function () {
      var forcedStartOfWeek = this.get('startOfWeek');
      if (forcedStartOfWeek) {
        return parseInt(forcedStartOfWeek, 10);
      }
      var now = this.get('powerCalendarService').getDate();
      var dayAbbr = withLocale(this.get('calendar.locale'), function () {
        return (0, _moment.default)(now).startOf('week').format('ddd');
      });
      return this.get('weekdaysShort').indexOf(dayAbbr);
    }),

    weekdaysNames: computed('localeStartOfWeek', 'weekdayFormat', 'calendar.locale', function () {
      var _getProperties = this.getProperties('localeStartOfWeek', 'weekdayFormat'),
          localeStartOfWeek = _getProperties.localeStartOfWeek,
          weekdayFormat = _getProperties.weekdayFormat;

      var format = 'weekdays' + (weekdayFormat === 'long' ? '' : weekdayFormat === 'min' ? 'Min' : 'Short');
      var weekdaysNames = this.get(format);
      return weekdaysNames.slice(localeStartOfWeek).concat(weekdaysNames.slice(0, localeStartOfWeek));
    }),

    days: computed('calendar', 'focusedId', 'localeStartOfWeek', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', function () {
      var today = this.get('powerCalendarService').getDate();
      var calendar = this.get('calendar');
      var lastDay = this.lastDay(calendar);
      var currentMoment = this.firstDay(calendar);
      var days = [];
      while (currentMoment.isBefore(lastDay)) {
        days.push(this.buildDay(currentMoment, today, calendar));
        currentMoment.add(1, 'day');
      }
      return days;
    }),

    weeks: computed('showDaysAround', 'days', function () {
      var _getProperties2 = this.getProperties('showDaysAround', 'days'),
          showDaysAround = _getProperties2.showDaysAround,
          days = _getProperties2.days;

      var weeks = [];
      var i = 0;
      while (days[i]) {
        var daysOfWeek = days.slice(i, i + 7);
        if (!showDaysAround) {
          daysOfWeek = daysOfWeek.filter(function (d) {
            return d.isCurrentMonth;
          });
        }
        weeks.push({
          id: days[i].moment.format('YYYY-w'),
          days: daysOfWeek,
          missingDays: 7 - daysOfWeek.length
        });
        i += 7;
      }
      return weeks;
    }),

    // Actions
    actions: {
      onFocusDay: function onFocusDay(day) {
        scheduleOnce('actions', this, this._updateFocused, day.id);
      },
      onBlurDay: function onBlurDay() {
        scheduleOnce('actions', this, this._updateFocused, null);
      },
      onKeyDown: function onKeyDown(calendar, e) {
        var focusedId = this.get('focusedId');
        if (focusedId) {
          var days = this.get('days');
          var day = void 0,
              index = void 0;
          for (var i = 0; i < days.length; i++) {
            if (days[i].id === focusedId) {
              index = i;
              break;
            }
          }
          if (e.keyCode === 38) {
            e.preventDefault();
            var newIndex = Math.max(index - 7, 0);
            day = days[newIndex];
            if (day.isDisabled) {
              for (var _i = newIndex + 1; _i <= index; _i++) {
                day = days[_i];
                if (!day.isDisabled) {
                  break;
                }
              }
            }
          } else if (e.keyCode === 40) {
            e.preventDefault();
            var _newIndex = Math.min(index + 7, days.length - 1);
            day = days[_newIndex];
            if (day.isDisabled) {
              for (var _i2 = _newIndex - 1; _i2 >= index; _i2--) {
                day = days[_i2];
                if (!day.isDisabled) {
                  break;
                }
              }
            }
          } else if (e.keyCode === 37) {
            day = days[Math.max(index - 1, 0)];
            if (day.isDisabled) {
              return;
            }
          } else if (e.keyCode === 39) {
            day = days[Math.min(index + 1, days.length - 1)];
            if (day.isDisabled) {
              return;
            }
          } else {
            return;
          }
          this.set('focusedId', day.id);
          scheduleOnce('afterRender', this, '_focusDate', day.id);
        }
      }
    },

    // Methods
    buildDay: function buildDay(dayMoment, today, calendar) {
      var id = dayMoment.format('YYYY-MM-DD');
      var momentDate = dayMoment.clone();

      return {
        id: id,
        number: momentDate.date(),
        date: momentDate.toDate(),
        moment: momentDate,
        isDisabled: this.dayIsDisabled(momentDate),
        isFocused: this.get('focusedId') === id,
        isCurrentMonth: momentDate.month() === calendar.center.month(),
        isToday: momentDate.isSame(today, 'day'),
        isSelected: this.dayIsSelected(momentDate, calendar)
      };
    },
    buildonSelectValue: function buildonSelectValue(day) {
      return day;
    },
    dayIsSelected: function dayIsSelected(dayMoment) {
      var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.get('calendar');

      return calendar.selected ? dayMoment.isSame(calendar.selected, 'day') : false;
    },
    dayIsDisabled: function dayIsDisabled(momentDate) {
      var isDisabled = !this.get('onSelect');
      if (isDisabled) {
        return true;
      }

      var minDate = this.get('minDate');
      if (minDate && momentDate.isBefore(minDate)) {
        return true;
      }

      var maxDate = this.get('maxDate');
      if (maxDate && momentDate.isAfter(maxDate)) {
        return true;
      }

      var disabledDates = this.get('disabledDates');
      if (disabledDates && disabledDates.some(function (d) {
        return momentDate.isSame(d, 'day');
      })) {
        return true;
      }

      return false;
    },
    firstDay: function firstDay(calendar) {
      var firstDay = calendar.center.clone().startOf('month');
      var localeStartOfWeek = this.get('localeStartOfWeek');
      while (firstDay.isoWeekday() % 7 !== localeStartOfWeek) {
        firstDay.add(-1, 'day');
      }
      return firstDay;
    },
    lastDay: function lastDay(calendar) {
      var localeStartOfWeek = this.get('localeStartOfWeek');
      var lastDay = calendar.center.clone().endOf('month');
      var localeEndOfWeek = (localeStartOfWeek + 6) % 7;
      while (lastDay.isoWeekday() % 7 !== localeEndOfWeek) {
        lastDay.add(1, 'day');
      }
      return lastDay;
    },
    _updateFocused: function _updateFocused(id) {
      this.set('focusedId', id);
    },
    _focusDate: function _focusDate(id) {
      var dayElement = this.element.querySelector('[data-date="' + id + '"]');
      if (dayElement) {
        dayElement.focus();
      }
    }
  });
});