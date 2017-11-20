define('ember-changeset-validations/validators/exclusion', ['exports', 'ember-changeset-validations/utils/validation-errors', 'ember-validators'], function (exports, _validationErrors, _emberValidators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validateInclusion;
  function validateInclusion() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.list) {
      options.in = options.list;
    }

    return function (key, value) {
      var result = (0, _emberValidators.validate)('exclusion', value, options, null, key);
      return result === true ? true : (0, _validationErrors.default)(key, result);
    };
  }
});