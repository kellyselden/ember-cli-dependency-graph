define('ember-changeset-validations/validators/presence', ['exports', 'ember-changeset-validations/utils/validation-errors', 'ember-validators'], function (exports, _validationErrors, _emberValidators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = validatePresence;
  function validatePresence(options) {
    if (typeof options === 'boolean') {
      options = { presence: options };
    }

    return function (key, value) {
      var result = (0, _emberValidators.validate)('presence', value, options, null, key);

      if (typeof result === 'boolean' || typeof result === 'string') {
        return result;
      } else {
        // We flipped the meaning behind `present` and `blank` so switch the two
        if (result.type === 'present') {
          result.type = 'blank';
        } else if (result.type === 'blank') {
          result.type = 'present';
        }

        return (0, _validationErrors.default)(key, result);
      }
    };
  }
});