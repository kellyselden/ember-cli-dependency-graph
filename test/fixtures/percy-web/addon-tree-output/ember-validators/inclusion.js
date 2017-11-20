define('ember-validators/inclusion', ['exports', 'ember', 'ember-validators/utils/validation-error'], function (exports, _ember, _emberValidatorsUtilsValidationError) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports['default'] = validateInclusion;
  var get = _ember['default'].get;
  var typeOf = _ember['default'].typeOf;
  var assert = _ember['default'].assert;
  var isEmpty = _ember['default'].isEmpty;
  var getProperties = _ember['default'].getProperties;

  /**
   *  @class Inclusion
   *  @module Validators
   */

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {Boolean} options.allowBlank If true, skips validation if the value is empty
   * @param {Array} options.in The list of values this attribute could be
   * @param {Array} options.range The range in which the attribute's value should reside in
   * @param {Object} model
   * @param {String} attribute
   */

  function validateInclusion(value, options, model, attribute) {
    var array = get(options, 'in');

    var _getProperties = getProperties(options, ['range', 'allowBlank']);

    var range = _getProperties.range;
    var allowBlank = _getProperties.allowBlank;

    assert('[validator:inclusion] [' + attribute + '] no options were passed in', !isEmpty(Object.keys(options)));

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (array && array.indexOf(value) === -1) {
      return (0, _emberValidatorsUtilsValidationError['default'])('inclusion', value, options);
    }

    if (range && range.length === 2) {
      var _range = _slicedToArray(range, 2);

      var min = _range[0];
      var max = _range[1];

      var equalType = typeOf(value) === typeOf(min) && typeOf(value) === typeOf(max);

      if (!equalType || min > value || value > max) {
        return (0, _emberValidatorsUtilsValidationError['default'])('inclusion', value, options);
      }
    }

    return true;
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */