define('ember-power-calendar/components/power-calendar-multiple/days', ['exports', 'ember-power-calendar/components/power-calendar/days', 'ember-power-calendar/utils/computed-fallback-if-undefined'], function (exports, _days, _computedFallbackIfUndefined) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _days.default.extend({
    maxLength: (0, _computedFallbackIfUndefined.default)(Infinity),

    // Methods
    dayIsSelected: function dayIsSelected(dayMoment) {
      var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.get('calendar');

      var selected = calendar.selected || [];
      return selected.some(function (d) {
        return dayMoment.isSame(d, 'day');
      });
    },
    dayIsDisabled: function dayIsDisabled(dayMoment) {
      var numSelected = this.get('calendar.selected.length') || 0;
      var maxLength = this.get('maxLength') || Infinity;
      return this._super.apply(this, arguments) || numSelected >= maxLength && !this.dayIsSelected(dayMoment);
    }
  });
});