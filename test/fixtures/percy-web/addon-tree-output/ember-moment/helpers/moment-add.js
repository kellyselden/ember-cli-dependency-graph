define('ember-moment/helpers/moment-add', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
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
  var typeOf = Ember.typeOf;
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
      var additionArgs = [];

      if (length === 1) {
        additionArgs.push(params[0]);
      } else if (length === 2 && typeOf(params[0]) === 'number' && typeOf(params[1]) === 'string') {
        additionArgs.push.apply(additionArgs, _toConsumableArray(params));
      } else {
        args.push(params[0]);
        additionArgs.push.apply(additionArgs, _toConsumableArray(params.slice(1)));
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).add.apply(_morphMoment, additionArgs.concat([precision]));
    })
  });
});