define('ghost-admin/services/power-calendar', ['exports', 'ember-power-calendar/services/power-calendar'], function (exports, _powerCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _powerCalendar.default;
    }
  });
});