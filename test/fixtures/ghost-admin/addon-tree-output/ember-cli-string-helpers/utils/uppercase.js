define('ember-cli-string-helpers/utils/uppercase', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = uppercase;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function uppercase() {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof string !== 'string') {
      throw new TypeError('Expected a string, got a ' + (typeof string === 'undefined' ? 'undefined' : _typeof(string)));
    }

    return string.toUpperCase();
  }
});