define('ember-moment/helpers/moment-format', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = Ember.isEmpty;
  var get = Ember.get;
  var observer = Ember.observer;
  exports.default = _base.default.extend({
    defaultFormatDidChange: observer('moment.defaultFormat', function () {
      this.recompute();
    }),

    compute: (0, _helperCompute.default)(function (params, _ref) {
      var _morphMoment;

      var locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = get(this, 'moment');
      var length = params.length;


      if (length > 3) {
        throw new TypeError('ember-moment: Invalid Number of arguments, expected at most 4');
      }

      var args = [];
      var formatArgs = [];
      var defaultFormat = get(this, 'moment.defaultFormat');

      args.push(params[0]);

      if (length === 1 && !isEmpty(defaultFormat)) {
        formatArgs.push(defaultFormat);
      } else if (length === 2) {
        formatArgs.push(params[1]);
      } else if (length > 2) {
        args.push(params[2]);
        formatArgs.push(params[1]);
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).format.apply(_morphMoment, formatArgs);
    })
  });
});