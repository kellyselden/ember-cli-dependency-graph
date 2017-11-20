define('ember-moment/helpers/moment-subtract', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = this.get('moment');
      var length = params.length;

      var args = [];
      var subtractionArgs = [];

      if (length === 1) {
        subtractionArgs.push(params[0]);
      } else if (length === 2 && Ember.typeOf(params[0]) === 'number' && Ember.typeOf(params[1]) === 'string') {
        subtractionArgs.push.apply(subtractionArgs, _toConsumableArray(params));
      } else {
        args.push(params[0]);
        subtractionArgs.push.apply(subtractionArgs, _toConsumableArray(params.slice(1)));
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).subtract.apply(_morphMoment, subtractionArgs.concat([precision]));
    })
  });
});