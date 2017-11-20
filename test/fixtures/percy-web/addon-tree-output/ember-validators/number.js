define('ember-validators/number', ['exports', 'ember', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberValidatorsUtilsValidationError) {
  exports['default'] = validateNumber;
  var get = _ember['default'].get;
  var isNone = _ember['default'].isNone;
  var isEmpty = _ember['default'].isEmpty;
  var getProperties = _ember['default'].getProperties;

  /**
   *  @class Number
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Boolean} options.allowBlank If true, skips validation if the value is empty
   * @param {Boolean} options.allowNone If true, skips validation if the value is null or undefined. __Default: true__
   * @param {Boolean} options.allowString If true, validator will accept string representation of a number
   * @param {Boolean} options.integer Number must be an integer
   * @param {Boolean} options.positive Number must be greater than 0
   * @param {Boolean} options.odd Number must be odd
   * @param {Boolean} options.even Number must be even
   * @param {Number} options.is Number must be equal to this value
   * @param {Number} options.lt Number must be less than this value
   * @param {Number} options.lte Number must be less than or equal to this value
   * @param {Number} options.gt Number must be greater than this value
   * @param {Number} options.gte Number must be greater than or equal to this value
   * @param {Number} options.multipleOf Number must be a multiple of this value
   * @param {Object} model
   * @param {String} attribute
   */

  function validateNumber(value, options) {
    var numValue = Number(value);
    var optionKeys = Object.keys(options);

    var _getProperties = getProperties(options, ['allowBlank', 'allowNone', 'allowString', 'integer']);

    var allowBlank = _getProperties.allowBlank;
    var _getProperties$allowNone = _getProperties.allowNone;
    var allowNone = _getProperties$allowNone === undefined ? true : _getProperties$allowNone;
    var allowString = _getProperties.allowString;
    var integer = _getProperties.integer;

    if (!allowNone && isNone(value)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('notANumber', value, options);
    }

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (typeof value === 'string' && (isEmpty(value) || !allowString)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('notANumber', value, options);
    }

    if (!isNumber(numValue)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('notANumber', value, options);
    }

    if (integer && !isInteger(numValue)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('notAnInteger', value, options);
    }

    for (var i = 0; i < optionKeys.length; i++) {
      var type = optionKeys[i];
      var returnValue = _validateType(type, options, numValue);

      if (typeof returnValue !== 'boolean') {
        return returnValue;
      }
    }

    return true;
  }

  function _validateType(type, options, value) {
    var expected = get(options, type);
    var actual = value;

    if (type === 'is' && actual !== expected) {
      return (0, _emberValidatorsUtilsValidationError['default'])('equalTo', value, options);
    } else if (type === 'lt' && actual >= expected) {
      return (0, _emberValidatorsUtilsValidationError['default'])('lessThan', value, options);
    } else if (type === 'lte' && actual > expected) {
      return (0, _emberValidatorsUtilsValidationError['default'])('lessThanOrEqualTo', value, options);
    } else if (type === 'gt' && actual <= expected) {
      return (0, _emberValidatorsUtilsValidationError['default'])('greaterThan', value, options);
    } else if (type === 'gte' && actual < expected) {
      return (0, _emberValidatorsUtilsValidationError['default'])('greaterThanOrEqualTo', value, options);
    } else if (type === 'positive' && actual < 0) {
      return (0, _emberValidatorsUtilsValidationError['default'])('positive', value, options);
    } else if (type === 'odd' && actual % 2 === 0) {
      return (0, _emberValidatorsUtilsValidationError['default'])('odd', value, options);
    } else if (type === 'even' && actual % 2 !== 0) {
      return (0, _emberValidatorsUtilsValidationError['default'])('even', value, options);
    } else if (type === 'multipleOf' && !isInteger(actual / expected)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('multipleOf', value, options);
    }

    return true;
  }

  /*
    Use polyfills instead of Number.isNaN or Number.isInteger to support IE & Safari
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */