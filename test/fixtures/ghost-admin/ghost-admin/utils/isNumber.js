define('ghost-admin/utils/isNumber', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (value) {
    return typeof value === 'number' || value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && toString.call(value) === '[object Number]' || false;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var toString = Object.prototype.toString;
});