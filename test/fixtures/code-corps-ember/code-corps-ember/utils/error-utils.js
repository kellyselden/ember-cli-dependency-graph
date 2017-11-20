define('code-corps-ember/utils/error-utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isValidationError = isValidationError;
  exports.isNonValidationError = isNonValidationError;
  exports.formatError = formatError;
  /**
   * Figures out if an error payload received from the server
   * contains validation errors and thus is a validation error payload
   *
   * This is done by checking for presence of a `source` property in
   * any of the received error objects.
   *
   * @param  {DS.AdapterError}  payload An instance of a `DS.AdapterError`
   * @return {Boolean}          `true` if the payload is a validaton error payload
   */
  function isValidationError(payload) {
    if (!payload.isAdapterError) {
      return false;
    }

    var errors = payload.errors || [];

    return errors.some(function (e) {
      return e.source;
    });
  }

  /**
   * isNonValidationError - function
   *
   * Returns the negation of isValidationError
   *
   * @param  {DS.AdapterError} payload An instance of a DS.Adapter error.
   * @return {Boolean}                 `true`, if the payload is a non-validation error.
   */
  function isNonValidationError(payload) {
    return !isValidationError(payload);
  }

  function formatError(error) {
    if (!error.payload && !error.payload.errors && !error.payload.errors.length) {
      return;
    }
    var errors = error.payload.errors;

    console.log(error);
    errors = errors.mapBy('detail');
    return !errors ? '' : errors.join(' ');
  }
});