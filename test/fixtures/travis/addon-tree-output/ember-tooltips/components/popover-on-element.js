define('ember-tooltips/components/popover-on-element', ['exports', 'ember-tooltips/components/lazy-render-wrapper'], function (exports, _lazyRenderWrapper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _lazyRenderWrapper.default.extend({
    tetherComponentName: 'tether-popover-on-element'
  });
});