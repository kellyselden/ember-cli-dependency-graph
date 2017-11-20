define('ember-validators/ds-error', ['exports', 'ember', 'ember-require-module', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberRequireModule, _emberValidatorsUtilsValidationError) {
  exports['default'] = validateDsError;
  exports.getPathAndKey = getPathAndKey;

  var DS = (0, _emberRequireModule['default'])('ember-data');

  if (!DS) {
    throw new Error('Ember-Data is required to use the DS Error validator.');
  }

  var get = _ember['default'].get;
  var isNone = _ember['default'].isNone;

  /**
   *  @class DS Error
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Object} model
   * @param {String} attribute
   */

  function validateDsError(value, options, model, attribute) {
    var _getPathAndKey = getPathAndKey(attribute);

    var path = _getPathAndKey.path;
    var key = _getPathAndKey.key;

    var errors = get(model, path);

    if (!isNone(errors) && errors instanceof DS.Errors && errors.has(key)) {
      return (0, _emberValidatorsUtilsValidationError['default'])('ds', null, options, get(errors.errorsFor(key), 'lastObject.message'));
    }

    return true;
  }

  function getPathAndKey(attribute) {
    var path = attribute.split('.');
    var key = path.pop();

    path.push('errors');

    return { path: path.join('.'), key: key };
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */