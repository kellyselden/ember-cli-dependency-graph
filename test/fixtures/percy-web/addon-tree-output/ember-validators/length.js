define('ember-validators/length', ['exports', 'ember', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberValidatorsUtilsValidationError) {
  exports['default'] = validateLength;
  var get = _ember['default'].get;
  var isNone = _ember['default'].isNone;
  var isEmpty = _ember['default'].isEmpty;
  var getProperties = _ember['default'].getProperties;

  /**
   *  @class Length
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Boolean} options.allowNone If true, skips validation if the value is null or undefined. __Default: true__
   * @param {Boolean} options.allowBlank If true, skips validation if the value is empty
   * @param {Boolean} options.useBetweenMessage If true, uses the between error message when `max` and `min` are both set
   * @param {Number} options.is The exact length the value can be
   * @param {Number} options.min The minimum length the value can be
   * @param {Number} options.max The maximum length the value can be
   * @param {Object} model
   * @param {String} attribute
   */

  function validateLength(value, options) {
    var _getProperties = getProperties(options, ['allowNone', 'allowBlank', 'useBetweenMessage', 'is', 'min', 'max']);

    var _getProperties$allowNone = _getProperties.allowNone;
    var allowNone = _getProperties$allowNone === undefined ? true : _getProperties$allowNone;
    var allowBlank = _getProperties.allowBlank;
    var useBetweenMessage = _getProperties.useBetweenMessage;
    var is = _getProperties.is;
    var min = _getProperties.min;
    var max = _getProperties.max;

    if (isNone(value)) {
      return allowNone ? true : (0, _emberValidatorsUtilsValidationError['default'])('invalid', value, options);
    }

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    var length = get(value, 'length');

    if (!isNone(is) && is !== length) {
      return (0, _emberValidatorsUtilsValidationError['default'])('wrongLength', value, options);
    }

    if (useBetweenMessage && !isNone(min) && !isNone(max) && (length < min || length > max)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('between', value, options);
    }

    if (!isNone(min) && min > length) {
      return (0, _emberValidatorsUtilsValidationError['default'])('tooShort', value, options);
    }

    if (!isNone(max) && max < length) {
      return (0, _emberValidatorsUtilsValidationError['default'])('tooLong', value, options);
    }

    return true;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */