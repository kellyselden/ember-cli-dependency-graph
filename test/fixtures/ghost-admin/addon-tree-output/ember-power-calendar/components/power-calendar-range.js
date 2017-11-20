define('ember-power-calendar/components/power-calendar-range', ['exports', 'ember-power-calendar/components/power-calendar', 'moment', 'ember-power-calendar/utils/computed-fallback-if-undefined'], function (exports, _powerCalendar, _moment, _computedFallbackIfUndefined) {
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

  var computed = Ember.computed;
  var getProperties = Ember.getProperties;
  var assign = Ember.assign;


  function parseDuration(value) {
    if (value === null || _moment.default.isDuration(value)) {
      return value;
    }
    if (typeof value === 'number') {
      return _moment.default.duration(value, 'days');
    }
    if (typeof value === 'string') {
      var _value$match = value.match(/(\d+)(.*)/),
          _value$match2 = _slicedToArray(_value$match, 3),
          quantity = _value$match2[1],
          units = _value$match2[2];

      units = units.trim() || 'days';
      return _moment.default.duration(parseInt(quantity, 10), units);
    }
  }

  exports.default = _powerCalendar.default.extend({
    daysComponent: 'power-calendar-range/days',
    minRange: (0, _computedFallbackIfUndefined.default)(_moment.default.duration(1, 'day')),
    maxRange: (0, _computedFallbackIfUndefined.default)(null),

    // CPs
    currentCenter: computed('center', function () {
      var center = this.get('center');
      if (center) {
        return (0, _moment.default)(center);
      }
      return (0, _moment.default)(this.get('selected.start') || this.get('powerCalendarService').getDate());
    }),

    minRangeDuration: computed('minRange', function () {
      return parseDuration(this.get('minRange'));
    }),

    maxRangeDuration: computed('maxRange', function () {
      return parseDuration(this.get('maxRange'));
    }),

    publicAPI: computed('_publicAPI', 'minRangeDuration', 'maxRangeDuration', function () {
      var rangeOnlyAPI = { minRange: this.get('minRangeDuration'), maxRange: this.get('maxRangeDuration') };
      return assign(rangeOnlyAPI, this.get('_publicAPI'));
    }),

    // Actions
    actions: {
      select: function select(day, calendar, e) {
        var range = this._buildRange(day);
        var _range$moment = range.moment,
            start = _range$moment.start,
            end = _range$moment.end;

        if (start && end) {
          var _get = this.get('publicAPI'),
              minRange = _get.minRange,
              maxRange = _get.maxRange;

          var diff = Math.abs(end.diff(start));
          if (diff < minRange.as('ms') || maxRange && diff > maxRange.as('ms')) {
            return;
          }
        }
        var action = this.get('onSelect');
        if (action) {
          action(range, calendar, e);
        }
      }
    },

    // Methods
    _buildRange: function _buildRange(day) {
      var selected = this.get('publicAPI.selected') || { start: null, end: null };

      var _getProperties = getProperties(selected, 'start', 'end'),
          start = _getProperties.start,
          end = _getProperties.end;

      if (start && !end) {
        var startMoment = (0, _moment.default)(start);
        if (startMoment.isAfter(day.moment)) {
          return {
            moment: { start: day.moment, end: startMoment },
            date: { start: day.date, end: startMoment.toDate() }
          };
        } else {
          return {
            moment: { start: startMoment, end: day.moment },
            date: { start: startMoment.toDate(), end: day.date }
          };
        }
      } else {
        return {
          moment: { start: day.moment, end: null },
          date: { start: day.date, end: null }
        };
      }
    }
  });
});