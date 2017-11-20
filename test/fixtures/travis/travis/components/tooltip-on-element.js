define('travis/components/tooltip-on-element', ['exports', 'ember-tooltips/components/tooltip-on-element'], function (exports, _tooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _tooltipOnElement.default.extend({
    enableLazyRendering: true
  });
});