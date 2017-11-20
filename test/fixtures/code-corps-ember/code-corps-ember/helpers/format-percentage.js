define('code-corps-ember/helpers/format-percentage', ['exports', 'code-corps-ember/utils/pretty-float'], function (exports, _prettyFloat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatPercentage = formatPercentage;

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

  var helper = Ember.Helper.helper;


  function applyFormatting(percentage) {
    return percentage.length == 0 ? '' : percentage + '%';
  }

  /**
   * Helper formats a float or a string representing a float into a percentage value.
   *
   * By default, the value will be formatted as `'22.5%'`.
   * If the number is an integer, the format will be `'22.0%'`
   *
   * To remove the zero deciamals, a "trimZero" named argument can be provided.
   * If this argument is set to `true`, the zero decimals
   * will be removed, so the format will be `'22%'`
   *
   * @param  {String}   percentageAsString The value to be formatted as percentage
   * @param  {Boolean}  options.trimZero   Option to remove the decimal part if the value of it is zero
   * @return {String}                      Value, formatted as percentage
   */
  function formatPercentage(_ref) {
    var _ref3 = _slicedToArray(_ref, 1),
        percentageAsString = _ref3[0];

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$trimZero = _ref2.trimZero,
        trimZero = _ref2$trimZero === undefined ? false : _ref2$trimZero;

    var percentage = (0, _prettyFloat.default)(percentageAsString, { numDecimals: 1, trimZero: trimZero });
    return applyFormatting(percentage);
  }

  exports.default = helper(formatPercentage);
});