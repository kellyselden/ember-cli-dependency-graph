define('ember-moment/helpers/moment-diff', ['exports', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _helperCompute, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var get = Ember.get;
  exports.default = _base.default.extend({
    compute: (0, _helperCompute.default)(function (params, _ref) {
      var precision = _ref.precision,
          float = _ref.float,
          locale = _ref.locale,
          timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      if (!params || params && params.length !== 2) {
        throw new TypeError('ember-moment: Invalid Number of arguments, must be 2');
      }

      var moment = get(this, 'moment');

      var _params = _slicedToArray(params, 2),
          dateA = _params[0],
          dateB = _params[1];

      return this.morphMoment(moment.moment(dateB), { locale: locale, timeZone: timeZone }).diff(dateA, precision, float);
    })
  });
});