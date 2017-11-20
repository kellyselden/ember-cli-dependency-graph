define('ember-power-calendar/services/power-calendar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var guidFor = Ember.guidFor;
  exports.default = Ember.Service.extend({
    date: null,

    // Lifecycle hooks
    init: function init() {
      this._super.apply(this, arguments);
      this._calendars = {};
    },


    // Methods
    getDate: function getDate() {
      return this.get('date') || new Date();
    },
    registerCalendar: function registerCalendar(calendar) {
      this._calendars[guidFor(calendar)] = calendar;
    },
    unregisterCalendar: function unregisterCalendar(calendar) {
      delete this._calendars[guidFor(calendar)];
    }
  });
});