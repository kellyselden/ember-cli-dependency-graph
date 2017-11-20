define('ember-moment/helpers/is-between', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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

      var precision = _ref.precision,
          inclusivity = _ref.inclusivity,
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = this.get('moment');
      var _params = [].concat(params);
      var length = params.length;


      if (length < 2 || length > 3) {
        throw new TypeError('ember-moment: Invalid Number of arguments, expected 2 or 3');
      }

      var args = [];

      if (length > 2) {
        args.push(_params.shift());
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).isBetween.apply(_morphMoment, _toConsumableArray(_params).concat([precision, inclusivity]));
    })
  });
});