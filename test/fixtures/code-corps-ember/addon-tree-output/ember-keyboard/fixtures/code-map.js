define('ember-keyboard/fixtures/code-map', ['exports', 'ember-keyboard/utils/generate-code-map'], function (exports, _generateCodeMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var platform = void 0,
      product = '';

  if (typeof FastBoot === 'undefined') {
    platform = navigator.platform;
    product = navigator.product;
  }

  exports.default = (0, _generateCodeMap.default)(platform, product);
});