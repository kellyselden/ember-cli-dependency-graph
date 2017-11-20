define('ember-moment/helpers/-base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var observer = Ember.observer,
      inject = Ember.inject,
      get = Ember.get,
      Helper = Ember.Helper,
      run = Ember.run;
  exports.default = Helper.extend({
    moment: inject.service(),
    disableInterval: false,

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