define('ember-moment/helpers/moment-to-date', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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

    globalAllowEmpty: false,

    compute: (0, _helperCompute.default)(function (params, _ref) {
      var _morphMoment;

      var hidePrefix = _ref.hidePrefix,
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = this.get('moment');

      return (_morphMoment = this.morphMoment(moment.moment(), { locale: locale, timeZone: timeZone })).to.apply(_morphMoment, _toConsumableArray(params).concat([hidePrefix]));
    })
  });
});