define('code-corps-ember/helpers/format-number', ['exports', 'code-corps-ember/utils/pretty-float'], function (exports, _prettyFloat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatNumber = formatNumber;

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


  var COMMAS_EVERY_THREE_DIGITS = /(\d)(?=(\d{3})+(?!\d))/g;

  function applyFormatting(number) {
    if (number.length == 0) {
      return '';
    } else {
      return '' + number.replace(COMMAS_EVERY_THREE_DIGITS, '$1,');
    }
  }

  /**
   * Used to display a number in the format of 20,000.50
   *
   * - commas every 3 digits
   * - dot as decimal separator when not trimming zero
   * - fixed 2-decimal notation when not trimming zero
   *
   * In order to display zero decimals, provide a hash, consisting of
   * `{ trimZero: false }` as the second parameter.
   *
   * @param  {String}  numberAsString   The value to be formatted
   * @param  {Boolean} options.trimZero  Indicates if zero decimals should be added
   * @return {String}                    The value, formatted
   */
  function formatNumber(_ref) {
    var _ref3 = _slicedToArray(_ref, 1),
        numberAsString = _ref3[0];

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$trimZero = _ref2.trimZero,
        trimZero = _ref2$trimZero === undefined ? true : _ref2$trimZero;

    var number = (0, _prettyFloat.default)(numberAsString, { trimZero: trimZero });
    return applyFormatting(number);
  }

  exports.default = helper(formatNumber);
});