define('code-corps-ember/helpers/format-currency', ['exports', 'code-corps-ember/helpers/format-number'], function (exports, _formatNumber) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatCurrency = formatCurrency;

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


  function applyFormatting(amount) {
    if (amount.length == 0) {
      return '';
    } else {
      return '$' + amount;
    }
  }

  /**
   * Used to display an amount (in dollars) as currency in the format of
   * $20,000.50
   *
   * - prefixed with a dollar sign
   * - commas every 3 digits
   * - dot as decimal separator
   * - fixed 2-decimal notation
   *
   * In order to not display zero decimals, provide a hash, consisting of
   * `{ trimZero: true }` as the second parameter.
   *
   * @param  {String}  dollarsAsString   The value to be formatted as currency
   * @param  {Boolean} options.trimZero  Indicates if zero decimals should be removed
   * @return {String}                    The value, formatted as currency
   */
  function formatCurrency(_ref) {
    var _ref3 = _slicedToArray(_ref, 1),
        dollarsAsString = _ref3[0];

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$trimZero = _ref2.trimZero,
        trimZero = _ref2$trimZero === undefined ? false : _ref2$trimZero;

    var dollarsAmount = (0, _formatNumber.formatNumber)([dollarsAsString], { trimZero: trimZero });
    return applyFormatting(dollarsAmount);
  }

  exports.default = helper(formatCurrency);
});