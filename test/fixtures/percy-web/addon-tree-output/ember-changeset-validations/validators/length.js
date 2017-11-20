define('ember-changeset-validations/validators/length', ['exports', 'ember-changeset-validations/utils/validation-errors', 'ember-changeset-validations/utils/with-defaults', 'ember-validators'], function (exports, _validationErrors, _withDefaults, _emberValidators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validateLength;
  function validateLength() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    options = (0, _withDefaults.default)(options, { useBetweenMessage: true });

    return function (key, value) {
      var result = (0, _emberValidators.validate)('length', value, options, null, key);
      return result === true ? true : (0, _validationErrors.default)(key, result);
    };
  }
});