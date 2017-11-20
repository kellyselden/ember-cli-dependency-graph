define('ember-power-calendar/components/power-calendar-range/days', ['exports', 'ember-power-calendar/components/power-calendar/days'], function (exports, _days) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getProperties = Ember.getProperties;
  exports.default = _days.default.extend({
    // Methods
    buildDay: function buildDay(dayMoment, today, calendar) {
      var day = this._super.apply(this, arguments);

      var _getProperties = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end'),
          start = _getProperties.start,
          end = _getProperties.end;

      if (start && end) {
        day.isSelected = dayMoment.isBetween(start, end, 'day', '[]');
        day.isRangeStart = day.isSelected && dayMoment.isSame(start, 'day');
        day.isRangeEnd = day.isSelected && dayMoment.isSame(end, 'day');
      } else {
        day.isRangeEnd = false;
        if (!start) {
          day.isRangeStart = false;
        } else {
          day.isRangeStart = day.isSelected = dayMoment.isSame(start, 'day');
          if (!day.isDisabled) {
            var diff = Math.abs(day.moment.diff(start));
            day.isDisabled = diff < calendar.minRange.as('ms') || calendar.maxRange !== null && diff > calendar.maxRange.as('ms');
          }
        }
      }
      return day;
    },
    dayIsSelected: function dayIsSelected() {
      return false;
    }
  });
});