define('ember-moment/helpers/is-same-or-before', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).isSameOrBefore.apply(_morphMoment, comparisonArgs.concat([precision]));
    })
  });
});