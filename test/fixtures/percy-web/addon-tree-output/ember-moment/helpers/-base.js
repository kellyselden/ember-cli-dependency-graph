define('ember-moment/helpers/-base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var run = Ember.run;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var observer = Ember.observer;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Helper.extend({
    moment: service(),
    disableInterval: false,
    globalAllowEmpty: computed.bool('moment.__config__.allowEmpty'),
    supportsGlobalAllowEmpty: true,
    localeOrTimeZoneChanged: observer('moment.locale', 'moment.timeZone', function () {
      this.recompute();
    }),

    compute: function compute(value, _ref) {
      var _this = this;

      var interval = _ref.interval;

      if (get(this, 'disableInterval')) {
        return;
      }

      this.clearTimer();

      if (interval) {
        /*
         * NOTE: intentionally a setTimeout so tests do not block on it
         * as the run loop queue is never clear so tests will stay locked waiting
         * for queue to clear.
         */
        this.intervalTimer = setTimeout(function () {
          run(function () {
            return _this.recompute();
          });
        }, parseInt(interval, 10));
      }
    },
    morphMoment: function morphMoment(time, _ref2) {
      var locale = _ref2.locale,
          timeZone = _ref2.timeZone;

      var momentService = get(this, 'moment');

      locale = locale || get(momentService, 'locale');
      timeZone = timeZone || get(momentService, 'timeZone');

      if (locale && time.locale) {
        time = time.locale(locale);
      }

      if (timeZone && time.tz) {
        time = time.tz(timeZone);
      }

      return time;
    },
    clearTimer: function clearTimer() {
      clearTimeout(this.intervalTimer);
    },
    destroy: function destroy() {
      this.clearTimer();
      this._super.apply(this, arguments);
    }
  });
});