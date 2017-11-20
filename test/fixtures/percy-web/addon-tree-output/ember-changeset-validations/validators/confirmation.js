define('ember-changeset-validations/validators/confirmation', ['exports', 'ember-changeset-validations/utils/validation-errors', 'ember-validators'], function (exports, _validationErrors, _emberValidators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validateConfirmation;
  function validateConfirmation() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function (key, newValue, _oldValue, changes /*, _content*/) {
      var result = (0, _emberValidators.validate)('confirmation', newValue, options, changes, key);
      return result === true ? true : (0, _validationErrors.default)(key, result);
    };
  }
});