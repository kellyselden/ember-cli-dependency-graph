define("ember-validators/utils/validation-error", ["exports"], function (exports) {
  exports["default"] = validationError;
  /**
   * Copyright 2016, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */

  function validationError(type, value, context, message) {
    return { type: type, value: value, context: context, message: message };
  }
});