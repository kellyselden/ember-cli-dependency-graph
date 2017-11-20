define('ember-power-calendar/components/power-calendar-multiple', ['exports', 'ember-power-calendar/components/power-calendar', 'moment'], function (exports, _powerCalendar, _moment) {
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

  var computed = Ember.computed;
  exports.default = _powerCalendar.default.extend({
    daysComponent: 'power-calendar-multiple/days',

    // CPs
    currentCenter: computed('center', function () {
      var center = this.get('center');
      if (center) {
        return (0, _moment.default)(center);
      }
      return (0, _moment.default)((this.get('selected') || [])[0] || this.get('powerCalendarService').getDate());
    }),

    // Actions
    actions: {
      select: function select(day, calendar, e) {
        var action = this.get('onSelect');
        if (action) {
          action(this._buildCollection(day), calendar, e);
        }
      }
    },

    // Methods
    _buildCollection: function _buildCollection(day) {
      var selected = this.get('publicAPI.selected') || [];
      var values = [];
      var index = -1;
      for (var i = 0; i < selected.length; i++) {
        if (day.moment.isSame(selected[i], 'day')) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        values = [].concat(_toConsumableArray(selected), [day.moment]);
      } else {
        values = selected.slice(0, index).concat(selected.slice(index + 1));
      }
      var moments = values.map(function (d) {
        return (0, _moment.default)(d);
      });
      return {
        moment: moments,
        date: moments.map(function (m) {
          return m.toDate();
        })
      };
    }
  });
});