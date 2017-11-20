define('ember-validators/confirmation', ['exports', 'ember', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberValidatorsUtilsValidationError) {
  exports['default'] = validateConfirmation;
  var get = _ember['default'].get;
  var assert = _ember['default'].assert;
  var isEqual = _ember['default'].isEqual;
  var isEmpty = _ember['default'].isEmpty;
  var isPresent = _ember['default'].isPresent;

  /**
   *  @class Confirmation
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {String} options.on The attribute to confirm against
   * @param {String} options.allowBlank If true, skips validation if the value is empty
   * @param {Object} model
   * @param {String} attribute
   */

  function validateConfirmation(value, options, model, attribute) {
    var on = get(options, 'on');
    var allowBlank = get(options, 'allowBlank');

    assert('[validator:confirmation] [' + attribute + '] option \'on\' is required', isPresent(on));

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (!isEqual(value, get(model, on))) {
      return (0, _emberValidatorsUtilsValidationError['default'])('confirmation', value, options);
    }

    return true;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */