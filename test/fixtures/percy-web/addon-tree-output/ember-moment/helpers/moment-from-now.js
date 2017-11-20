define('ember-moment/helpers/moment-from-now', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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
    compute: (0, _helperCompute.default)(function (params, _ref) {
      var hideSuffix = _ref.hideSuffix,
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = get(this, 'moment');

      return this.morphMoment(moment.moment.apply(moment, _toConsumableArray(params)), { locale: locale, timeZone: timeZone }).fromNow(hideSuffix);
    })
  });
});