define('ember-moment/helpers/is-after', ['exports', 'ember-moment/helpers/-base', 'ember-moment/utils/helper-compute'], function (exports, _base, _helperCompute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _base.default.extend({
    compute: (0, _helperCompute.default)(function (params, _ref) {
      var _morphMoment;

      var precision = _ref.precision,
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = get(this, 'moment');
      var length = params.length;

      var args = [];
      var comparisonArgs = [];

      if (length === 1) {
        comparisonArgs.push(params[0]);
      } else if (length === 2) {
        args.push(params[0]);
        comparisonArgs.push(params[1]);
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).isAfter.apply(_morphMoment, comparisonArgs.concat([precision]));
    })
  });
});