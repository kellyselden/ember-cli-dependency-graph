define('ember-validators/presence', ['exports', 'ember', 'ember-validators/utils/validation-error', 'ember-validators/utils/unwrap-proxy'], function (exports, _ember, _emberValidatorsUtilsValidationError, _emberValidatorsUtilsUnwrapProxy) {
  exports['default'] = validatePresence;
  var assert = _ember['default'].assert;
  var isEmpty = _ember['default'].isEmpty;
  var isPresent = _ember['default'].isPresent;
  var getProperties = _ember['default'].getProperties;

  /**
   *  @class Presence
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Boolean} options.presence If true validates that the given value is not empty,
   *                                   if false, validates that the given value is empty.
   * @param {Boolean} options.ignoreBlank If true, treats an empty or whitespace string as not present
   * @param {Object} model
   * @param {String} attribute
   */

  function validatePresence(value, options, model, attribute) {
    var _getProperties = getProperties(options, ['presence', 'ignoreBlank']);

    var presence = _getProperties.presence;
    var ignoreBlank = _getProperties.ignoreBlank;

    var v = (0, _emberValidatorsUtilsUnwrapProxy['default'])(value);
    var _isPresent = ignoreBlank ? isPresent(v) : !isEmpty(v);

    assert('[validator:presence] [' + attribute + '] option \'presence\' is required', isPresent(presence));

    if (presence === true && !_isPresent) {
      return (0, _emberValidatorsUtilsValidationError['default'])('blank', value, options);
    }

    if (presence === false && _isPresent) {
      return (0, _emberValidatorsUtilsValidationError['default'])('present', value, options);
    }

    return true;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */