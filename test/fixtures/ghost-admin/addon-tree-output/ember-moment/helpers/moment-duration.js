define('ember-moment/helpers/moment-duration', ['exports', 'moment', 'ember-moment/helpers/-base'], function (exports, _moment, _base) {
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

  var get = Ember.get;
  exports.default = _base.default.extend({
    compute: function compute(params, _ref) {
      var locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);
      var momentService = get(this, 'moment');

      if (!params || params && params.length > 2) {
        throw new TypeError('ember-moment: Invalid Number of arguments, at most 2');
      }

      var result = momentService.moment(_moment.default.duration.apply(_moment.default, _toConsumableArray(params)));

      return this.morphMoment(result._i, { locale: locale, timeZone: timeZone }).humanize();
    }
  });
});