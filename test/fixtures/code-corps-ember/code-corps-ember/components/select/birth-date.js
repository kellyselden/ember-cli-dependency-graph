define('code-corps-ember/components/select/birth-date', ['exports', 'moment', 'code-corps-ember/utils/array-utils'], function (exports, _moment, _arrayUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['select-birth-date'],

    selectedMoment: computed('month', 'year', function () {
      var _getProperties = getProperties(this, 'month', 'year'),
          month = _getProperties.month,
          year = _getProperties.year;

      return (0, _moment.default)(year + '-' + month, 'Y-M');
    }),

    monthOptions: computed(function () {
      return _moment.default.months().map(this._formatMonth);
    }),

    dayOptions: computed('selectedMoment', function () {
      var selectedMoment = get(this, 'selectedMoment');
      var maxDay = selectedMoment.daysInMonth();

      return (0, _arrayUtils.range)(1, maxDay);
    }),

    yearOptions: computed(function () {
      var thisYear = (0, _moment.default)().year();
      return (0, _arrayUtils.range)(thisYear - 120, thisYear).reverse();
    }),

    update: function update(property, value) {
      set(this, property, value);

      if (property === 'month') {
        this._constrainDay();
      }

      if (property === 'year') {
        this._constrainDay();
        this._constrainMonth();
      }
    },
    _constrainDay: function _constrainDay() {
      var day = get(this, 'day');
      var days = get(this, 'dayOptions');
      var maxDay = days[days.length - 1];
      if (day > maxDay) {
        set(this, 'day', maxDay);
      }
    },
    _constrainMonth: function _constrainMonth() {
      var month = get(this, 'month');
      var months = get(this, 'monthOptions');
      var maxMonth = months[months.length - 1];
      if (month > maxMonth.number) {
        set(this, 'month', maxMonth.number);
      }
    },
    _formatMonth: function _formatMonth(name, index) {
      return { text: name, number: index + 1 };
    }
  });
});