define('ember-moment/helpers/moment', ['exports', 'ember-moment/helpers/-base'], function (exports, _base) {
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

  exports.default = _base.default.extend({
    moment: Ember.inject.service(),

    compute: function compute(params, _ref) {
      var locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = this.get('moment');

      return this.morphMoment(moment.moment.apply(moment, _toConsumableArray(params)), { locale: locale, timeZone: timeZone });
    }
  });
});