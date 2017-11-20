define('ember-changeset-validations/validators/format', ['exports', 'ember-changeset-validations/utils/validation-errors', 'ember-validators'], function (exports, _validationErrors, _emberValidators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validateInclusion;
  var isEmpty = Ember.isEmpty;
  function validateInclusion() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hasOptions = !isEmpty(Object.keys(options));

    return function (key, value) {
      if (!hasOptions) {
        return true;
      }

      var result = (0, _emberValidators.validate)('format', value, options, null, key);
      return result === true ? true : (0, _validationErrors.default)(key, result);
    };
  }
});