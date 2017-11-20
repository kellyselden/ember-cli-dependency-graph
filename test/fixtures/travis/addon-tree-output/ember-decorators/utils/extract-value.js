define('ember-decorators/utils/extract-value', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = extractValue;
  function extractValue(desc) {
    return desc.value || typeof desc.initializer === 'function' && desc.initializer();
  }
});