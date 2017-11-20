define('ember-tooltips/components/tether-tooltip-on-component', ['exports', 'ember-tooltips/components/tether-tooltip-on-element', 'ember-tooltips/utils'], function (exports, _tetherTooltipOnElement, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _tetherTooltipOnElement.default.extend({
    target: _utils.onComponentTarget
  });
});