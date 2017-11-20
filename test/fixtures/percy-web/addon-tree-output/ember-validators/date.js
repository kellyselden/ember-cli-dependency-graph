define('ember-validators/date', ['exports', 'ember', 'ember-validators/utils/validation-error', 'ember-require-module'], function (exports, _ember, _emberValidatorsUtilsValidationError, _emberRequireModule) {
  exports['default'] = validateDate;
  exports.parseDate = parseDate;

  var moment = (0, _emberRequireModule['default'])('moment');

  if (!moment) {
    throw new Error('MomentJS is required to use the Date validator.');
  }

  var getWithDefault = _ember['default'].getWithDefault;
  var getProperties = _ember['default'].getProperties;
  var isNone = _ember['default'].isNone;
  var isEmpty = _ember['default'].isEmpty;
  var set = _ember['default'].set;

  /**
   * @class Date
   * @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Boolean} options.allowBlank If true, skips validation if the value is empty
   * @param {String} options.before The specified date must be before this date
   * @param {String} options.onOrBefore The specified date must be on or before this date
   * @param {String} options.after The specified date must be after this date
   * @param {String} options.onOrAfter The specified date must be on or after this date
   * @param {String} options.precision Limit the comparison check to a specific granularity.
   *                                   Possible Options: [`year`, `month`, `week`, `day`, `hour`, `minute`, `second`].
   * @param {String} options.format Input value date format
   * @param {String} options.errorFormat Error output date format. Defaults to `MMM Do, YYYY`
   * @param {Object} model
   * @param {String} attribute
   */

  function validateDate(value, options) {
    var errorFormat = getWithDefault(options, 'errorFormat', 'MMM Do, YYYY');

    var _getProperties = getProperties(options, ['format', 'precision', 'allowBlank']);

    var format = _getProperties.format;
    var precision = _getProperties.precision;
    var allowBlank = _getProperties.allowBlank;

    var _getProperties2 = getProperties(options, ['before', 'onOrBefore', 'after', 'onOrAfter']);

    var before = _getProperties2.before;
    var onOrBefore = _getProperties2.onOrBefore;
    var after = _getProperties2.after;
    var onOrAfter = _getProperties2.onOrAfter;

    var date = undefined;

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (format) {
      date = parseDate(value, format, true);
      if (!date.isValid()) {
        return (0, _emberValidatorsUtilsValidationError['default'])('wrongDateFormat', value, options);
      }
    } else {
      date = parseDate(value);
      if (!date.isValid()) {
        return (0, _emberValidatorsUtilsValidationError['default'])('date', value, options);
      }
    }

    if (before) {
      before = parseDate(before, format);
      if (!date.isBefore(before, precision)) {
        set(options, 'before', before.format(errorFormat));
        return (0, _emberValidatorsUtilsValidationError['default'])('before', value, options);
      }
    }

    if (onOrBefore) {
      onOrBefore = parseDate(onOrBefore, format);
      if (!date.isSameOrBefore(onOrBefore, precision)) {
        set(options, 'onOrBefore', onOrBefore.format(errorFormat));
        return (0, _emberValidatorsUtilsValidationError['default'])('onOrBefore', value, options);
      }
    }

    if (after) {
      after = parseDate(after, format);
      if (!date.isAfter(after, precision)) {
        set(options, 'after', after.format(errorFormat));
        return (0, _emberValidatorsUtilsValidationError['default'])('after', value, options);
      }
    }

    if (onOrAfter) {
      onOrAfter = parseDate(onOrAfter, format);
      if (!date.isSameOrAfter(onOrAfter, precision)) {
        set(options, 'onOrAfter', onOrAfter.format(errorFormat));
        return (0, _emberValidatorsUtilsValidationError['default'])('onOrAfter', value, options);
      }
    }

    return true;
  }

  function parseDate(date, format) {
    var useStrict = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (date === 'now' || isEmpty(date)) {
      return moment();
    }

    return isNone(format) ? moment(new Date(date)) : moment(date, format, useStrict);
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */