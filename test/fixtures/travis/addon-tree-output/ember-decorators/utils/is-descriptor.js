define('ember-decorators/utils/is-descriptor', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isDescriptor;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function isDescriptor(item) {
    return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && 'enumerable' in item && 'configurable' in item;
  }
});