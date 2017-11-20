define('code-corps-ember/utils/pretty-float', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = prettyFloat;
  function cleanupDecimals(value, numDecimals, trimZero) {
    var roundedValue = parseFloat(value.toFixed(numDecimals));
    var noDecimals = roundedValue - Math.floor(roundedValue) == 0;
    var decimalCount = trimZero && noDecimals ? 0 : numDecimals;

    return roundedValue.toFixed(decimalCount);
  }

  /**
   * Makes a float "pretty" by rounding it to the specified number of decimals.
   *
   * The default number of decimals is 2.
   *
   * If the number is integer, it still displays as "X.00" by default. A `trimZero` option
   * is available to format it as "X" instead.
   *
   * @param  {String}  valueAsString        A string representing a numeric value to be made 'pretty'
   * @param  {Number}  options.numDecimals  Number of decimals to round to
   * @param  {Boolean} options.trimZero     A flag indicating if decimals should be trimmed away if the number is integer
   * @return {String}                       A string representing a float made 'pretty.'
   */
  function prettyFloat(valueAsString) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$numDecimals = _ref.numDecimals,
        numDecimals = _ref$numDecimals === undefined ? 2 : _ref$numDecimals,
        _ref$trimZero = _ref.trimZero,
        trimZero = _ref$trimZero === undefined ? false : _ref$trimZero;

    var value = parseFloat(valueAsString);

    // parseFloat can only be NaN, or an actual number
    return isNaN(value) ? '' : cleanupDecimals(value, numDecimals, trimZero);
  }
});