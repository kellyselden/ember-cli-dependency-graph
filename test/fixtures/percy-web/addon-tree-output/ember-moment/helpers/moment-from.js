define('ember-moment/helpers/moment-from', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var get = Ember.get;
  exports.default = _base.default.extend({
    compute: (0, _helperCompute.default)(function (_ref, _ref2) {
      var _morphMoment;

      var _ref3 = _toArray(_ref),
          datetime = _ref3[0],
          params = _ref3.slice(1);

      var locale = _ref2.locale,
          timeZone = _ref2.timeZone;

      this._super.apply(this, arguments);

      var moment = get(this, 'moment');

      return (_morphMoment = this.morphMoment(moment.moment(datetime), { locale: locale, timeZone: timeZone })).from.apply(_morphMoment, _toConsumableArray(params));
    })
  });
});