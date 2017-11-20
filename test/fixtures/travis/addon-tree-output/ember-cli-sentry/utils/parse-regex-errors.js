define("ember-cli-sentry/utils/parse-regex-errors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parseRegexErrors = parseRegexErrors;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   * @module ember-cli-sentry/utils/parse-regex-errors
   */

  /**
   * Uniformize an array of mixed string patterns and RegExp objects by converting
   * any String pattern to RegExp.
   *
   * @param {Array} errors Mixed string patterns and RegExp objects
   * @return {Array}
   */
  function parseRegexErrors(errors) {
    if (!errors || errors.constructor !== Array) {
      return [];
    }

    var regex = new RegExp(/^\/(.*)\/([gimuy]*)$/);
    var regexGroups = { pattern: 1, flags: 2 };

    return errors.map(function (error) {
      if ((typeof error === "undefined" ? "undefined" : _typeof(error)) && regex.test(error)) {
        var match = regex.exec(error);
        return new RegExp(match[regexGroups.pattern], match[regexGroups.flags]);
      }

      return error;
    });
  }
});