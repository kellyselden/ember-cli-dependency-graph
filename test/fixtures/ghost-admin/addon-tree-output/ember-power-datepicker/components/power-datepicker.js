define('ember-power-datepicker/components/power-datepicker', ['exports', 'ember-power-datepicker/templates/components/power-datepicker', 'moment', 'ember-power-datepicker/utils/computed-properties'], function (exports, _powerDatepicker, _moment, _computedProperties) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _powerDatepicker.default,
    closeOnSelect: true,
    tagName: '',
    format: 'YYYY/MM/DD',
    onCenterChange: (0, _computedProperties.fallbackAction)(function (day) {
      this.set('center', day.date);
    }),

    // Actions
    actions: {
      onSelect: function onSelect(day, datepicker, e) {
        var _getProperties = this.getProperties('onSelect', 'closeOnSelect'),
            onSelect = _getProperties.onSelect,
            closeOnSelect = _getProperties.closeOnSelect;

        var value = onSelect(day, datepicker, e);
        if (value === false || !closeOnSelect) {
          return;
        }
        datepicker.actions.close();
      }
    },

    // Helpers
    formatDate: function formatDate(selected, format) {
      if (selected) {
        return (0, _moment.default)(selected).format(format);
      }
    }
  });
});