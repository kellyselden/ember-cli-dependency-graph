define('ember-tooltips/components/tether-popover-on-component', ['exports', 'ember-tooltips/components/tether-popover-on-element', 'ember-tooltips/utils'], function (exports, _tetherPopoverOnElement, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _tetherPopoverOnElement.default.extend({
    target: _utils.onComponentTarget
  });
});