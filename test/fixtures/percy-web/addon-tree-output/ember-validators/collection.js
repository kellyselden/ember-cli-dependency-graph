define('ember-validators/collection', ['exports', 'ember', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberValidatorsUtilsValidationError) {
  exports['default'] = validateCollection;
  var get = _ember['default'].get;
  var assert = _ember['default'].assert;
  var isArray = _ember['default'].isArray;
  var isPresent = _ember['default'].isPresent;

  /**
   *  @class Collection
   *  @module Validators
   */

  /**
    * @method validate
    * @param {Any} value
    * @param {Object} options
    * @param {Boolean} options.collection
    * @param {Object} model
    * @param {String} attribute
    */

  function validateCollection(value, options, model, attribute) {
    var collection = get(options, 'collection');

    assert('[validator:collection] [' + attribute + '] option \'collection\' is required', isPresent(collection));

    if (collection === true && !isArray(value)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('collection', value, options);
    }

    if (collection === false && isArray(value)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('singular', value, options);
    }

    return true;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */